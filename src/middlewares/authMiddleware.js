exports.isAuthenticated = (req, res, next) => {
    if (!req.session.user) {
        req.session.url = req.originalUrl;
        
        return res.redirect('/auth/login');
    }

    next();
};

exports.isNotAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return res.redirect('/user/dashboard');
    }

    next();
};