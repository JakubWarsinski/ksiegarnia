exports.sessionDataMiddleware = async (req, res, next) => {
    res.locals.user = req.session?.user || null;

    next();
};