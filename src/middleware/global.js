const setLocals = (req, res) => {
    res.locals.NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';
}

const globalMiddleware = (req, res, next) => {
    setLocals(req, res);
    next();
}

export default globalMiddleware;