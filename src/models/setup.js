import db from './db.js';

const allTablesExists = async() => {
    const tables = [];
    const res = await db.query(
        '',
        [tables]
    );
    return res.rowCount === tables.length;
}

const isAlreadyInitialized = async(verbose = true) => {
    if (verbose) {
        console.log('Checking existing schema')
    }

    const tablesOk = await allTablesExists();
    if (!tablesOk) {
        return false;
    }
}

const setupDatabase = async() => {
    const verbose = process.env.ENABLE_SQL_LOGGING === 'true';

    try {
        if (await isAlreadyInitialized(verbose)) {
            if (verbose) console.log('Setting up database...');
            return true;
        } 

        if (verbose) console.log('Setting up database...');
        
        if (verbose) {
            console.log('Databse setup complete');
        }
    } catch (err) {
        console.error('Error setting up databse:', err.message);
        throw err;
    }
}

const testConnection = async() => {
    try {
        const result = await db.query('SELECT NOW() as current_time');
        console.log('Databse connection successful:', result.rows[0].current_time);
        return true;
    } catch (err) {
        console.error('Database connection failed:', err.message);
        throw err;
    }
}

export { setupDatabase, testConnection };