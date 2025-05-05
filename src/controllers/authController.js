const bcrypt = require('bcrypt');
const authModel = require('../models/authModel.js');
const saltRounds = 10;

const render = {
    login : 'auth/login',
    register : 'auth/register',
    forgot : 'auth/forgot',
    reset : 'auth/reset'
};

const redirect = {
    main : '/home',
    login : '/auth',
    register : '/auth/new',
    forgot : '/auth/forgot',
    reset : '/auth/reset',
    dashboard : '/user/dashboard'
};

///////////////////////////////////
//            SIGN IN            //
///////////////////////////////////

exports.loginPage = async (req, res) => {
    if (req.session.user) return res.redirect(redirect.dashboard);

    return res.render(render.login);
};

exports.loginHandle = async (req, res) => {    
    const { email, password } = req.body;

    try {
        const user = await authModel.selectUser('id_klienta, login, haslo', { email });
        
        if (!user) throw 'Nie ma takiego użytkownika.';

        const match = await bcrypt.compare(password, user.haslo);
        
        if (!match) throw 'Nieprawidłowy e-mail lub hasło.';

        const { data : carts, count : cartCount } = await authModel.selectItemWithCount('koszyk', user.id_klienta);
        const { data : favorites, count : favoriteCount } = await authModel.selectItemWithCount('ulubione_ksiazki', user.id_klienta);
        
        req.session.user = {
            'id' : user.id_klienta,
            'login' : user.login,
            'cartBooks' : carts.map(cr => cr.id_ksiazki),
            'favoriteBooks' : favorites.map(fav => fav.id_ksiazki),
            'cartAmount' : cartCount,
            'favoriteAmount' : favoriteCount
        }

        const redirectTo = req.session.redirectTo || '/home';
        
        delete req.session.redirectTo;

        return res.redirect(redirectTo);
    } catch(error) {
        return res.render(render.login, { error });
    }
};

///////////////////////////////////
//            SIGN UP            //
///////////////////////////////////

exports.registerPage = (req, res) => {
    return res.render(render.register);
};

exports.registerHandle = async (req, res) => { 
    const { login, email, password : haslo } = req.body;
    
    try {
        const user = await authModel.selectUser('id_klienta, login, haslo', `email.eq.${email},login.eq.${login}`, true);

        if (user) throw 'Użytkownik z takim loginem lub e-mailem już istnieje.';

        const hashedPassword = await bcrypt.hash(haslo, saltRounds);

        await authModel.insertUser({ login, email, haslo : hashedPassword })

        return res.redirect(redirect.login);
    } catch (error) {
        return res.render(render.register, { error });
    }
};

///////////////////////////////////
//       CREATE RESET CODE       //
///////////////////////////////////

exports.forgotPasswordPage = (req, res) => {
    return res.render(render.forgot);
};

exports.forgotPasswordHandle = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await authModel.selectUser('id_klienta, login, haslo', { email });
                
        if (!user) throw "Nie znaleziono takiego e-maila.";

        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

        req.session.reset = { code: verificationCode, userId: user.id_klienta };

        return res.redirect(redirect.reset);
    } catch (error) {
        return res.render(render.forgot, { error });
    }
};

///////////////////////////////////
//        CHECK RESET CODE       //
///////////////////////////////////

exports.resetPasswordPage = (req, res) => {
    if (!req.session.reset) return res.redirect(redirect.forgot);

    return res.render(render.reset, { code : req.session.reset.code });
};

exports.resetPasswordHandle = async (req, res) => {
    const { resetCode, password : haslo } = req.body;
    const { code, userId } = req.session.reset;
    
    try {
        if (resetCode != code) throw 'Wpisano nieprawidłowy kod.';

        const hashedPassword = await bcrypt.hash(haslo, saltRounds);

        await authModel.updateUser({ haslo : hashedPassword }, userId);

        delete req.session.reset;

        return res.redirect(redirect.login);
    } catch (error) {
        if (!req.session.reset) return res.redirect(redirect.forgot);

        return res.render(render.reset, { error, code : req.session.reset.code });
    }
};

///////////////////////////////////
//            LOGOUT             //
///////////////////////////////////

exports.logoutPage = (req, res) => {    
    req.session.destroy(error => {
        if (error) return res.redirect(redirect.login);

        return res.redirect(redirect.main);
    });
};