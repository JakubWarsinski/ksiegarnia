exports.isAuthenticated = (req, res, next) => {
    if (!req.session.user) {
        req.session.redirectTo = req.originalUrl;
        return res.redirect('/user');
    }
    next();
};