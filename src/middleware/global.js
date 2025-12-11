const setHeadAssetsFunctionality = (res) => {
    res.locals.styles = [];
    res.locals.scripts = [];

    res.addStyle = (css, priority = 0) => {
        res.locals.styles.push({ content: css, priority });
    };

    res.addScript = (js, priority = 0) => {
        res.locals.scripts.push({ content: js, priority });
    };

    // These functions will be available in EJS templates
    res.locals.renderStyles = () => {
        return res.locals.styles
            // Sort by priority: higher numbers come first (b - a = descending)
            // Example: priority 20 comes before priority 10
            .sort((a, b) => b.priority - a.priority)
            // Extract just the HTML content from each object
            // Changes [{content: '<link...>', priority: 10}] to ['<link...>']
            .map(item => item.content)
            // Join all HTML strings together with newlines between them
            .join('\n');
    };

    res.locals.renderScripts = () => {
        return res.locals.scripts
            // Sort by priority: higher numbers come first (b - a = descending)
            // Example: priority 20 comes before priority 10  
            .sort((a, b) => b.priority - a.priority)
            // Extract just the HTML content from each object
            // Changes [{content: '<script...>', priority: 5}] to ['<script...>']
            .map(item => item.content)
            // Join all HTML strings together with newlines between them
            .join('\n');
    };
}

const setLocals = (req, res) => {
    res.locals.NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';
    res.locals.currentYear = new Date().getFullYear();

    res.locals.activeRoute = req.path; // Set the active page based on the request path

    // Check if user is logged in via session
    res.locals.loggedIn = req.session && req.session.user ? true : false;
}

const globalMiddleware = (req, res, next) => {
    setLocals(req, res);
    setHeadAssetsFunctionality(res);
    next();
}

export default globalMiddleware;