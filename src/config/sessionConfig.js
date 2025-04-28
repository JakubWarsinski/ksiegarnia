module.exports = {
    secret: process.env.SESSION_COOKIES,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 dni
    }
};