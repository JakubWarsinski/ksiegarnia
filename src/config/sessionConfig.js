module.exports = {
    secret: 'MDK_Ksiegarnia_School_Project_Cookies',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};