exports.isAuthenticated = (req, res, next) => {
    if (!req.session.user) {
        req.session.redirectTo = req.originalUrl;
        
        return res.redirect('/auth');
    }

    next();
};

exports.isNotAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return res.redirect('/user/dashboard');
    }

    next();
};