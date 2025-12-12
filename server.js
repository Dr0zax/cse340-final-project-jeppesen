import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';

import { setupDatabase, testConnection } from './src/models/setup.js';

import routes from './src/controllers/routes.js';
import globalMiddleware from './src/middleware/global.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV?.toLocaleLowerCase() || 'development';

const pgSession = connectPgSimple(session);

// When running behind a proxy (e.g., Render), enable trust proxy
// so secure cookies and redirect behavior work as expected.
if (!NODE_ENV.includes('dev')) {
    app.set('trust proxy', 1);
}

app.use(session({
    store: new pgSession({
        conString: process.env.DB_URL,
        tableName: 'session',
        createTableIfMissing: true
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: NODE_ENV.includes('dev') !== true,
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    }
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));


app.use(globalMiddleware);

app.use('/', routes);

app.use((req, res, next) => {
    const err = new Error('Page Not Found');
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    const status = err.status || 500;
    const template = status === 500? '500' : '404';

    if (status === 400) {
        console.error("Error: ", err.message);
        console.error("Status: ", err.status);
    }

    const context = {
        title: status === 500 ? 'Server Error' : 'Page Not Found',
        error: err.message,
        stack: NODE_ENV.includes('dev') ? err.stack : undefined
    };

    res.status(status).render(`errors/${template}`, context);
});

if (NODE_ENV.includes('dev')) {
    const ws = await import('ws');

    try {
        const wsPort = parseInt(PORT) + 1;
        const wsServer = new ws.WebSocketServer({ port: wsPort });
        wsServer.on('listening', () => {
            console.log(`Websocket running on port ${wsPort}`);
        })

        wsServer.on('error', (error) => {
            console.error('Websocket server error:', error);
        })
    } catch (error) {
        console.error("Failed to start WebSocket server", error);
    }
}

app.listen(PORT, async () => {
    try {
        await setupDatabase();
        await testConnection();
        console.log(`Server is running on port http://127.0.0.1:${PORT}`);

    } catch (err) {
        console.error("Failed to start server:", err.message);
        process.exit(1);
    }
});