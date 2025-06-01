const bcrypt = require('bcrypt');
const { query } = require('../utils/queryHelper');


exports.loginPage = (req, res) => res.render('auth/login');


exports.loginHandle = async (req, res) => { 
    const { email, password } = req.body;

    const findUser = 'SELECT id_klienta, login, haslo FROM klienci WHERE email = ?;';
    
    const getStorage = 'SELECT id_ksiazki FROM schowek WHERE id_klienta = ? AND posiadane = 1 AND czy_koszyk = ? GROUP BY id_ksiazki;';

    try {
        const user = await query('single', findUser, [ email ]);

        if (!user) throw `Nie odnaleziono użytkownika o podanym e-mail'u.`;

        const match = await bcrypt.compare(password, user.haslo);

        if (!match) throw 'Podano nieprawidłowe hasło, lub e-mail.';

        const cart = await query('all', getStorage, [ user.id_klienta, 1 ]);
        const favorite = await query('all', getStorage, [ user.id_klienta, -1 ]);

        req.session.user = {
            id : user.id_klienta,
            login : user.login,
            car : cart.map(row => row.id_ksiazki),
            carAmount : cart.length,
            fav : favorite.map(row => row.id_ksiazki),
            favAmount : favorite.length
        }

        const path = req.session.url || '/user/dashboard';

        delete req.session.url;

        return res.redirect(path);
    } catch(error) {
        console.log(error);

        return res.render('auth/login', { error });
    }
}


exports.registerPage = (req, res) => res.render('auth/register');


exports.registerHandle = async (req, res) => { 
    const { login, email, password } = req.body;

    const findUser = 'SELECT id_klienta FROM klienci WHERE email = ? OR login = ?;';

    const makeNewUser = 'INSERT INTO klienci (login, email, haslo) VALUES (?, ?, ?);';
    
    try {
        const user = await query('single', findUser, [ email, login ]);

        if (user) throw `Użytkownik o podanym e-mail'u, lub logine już istnieje.`;

        const hashedPassword = await bcrypt.hash(password, 10);

        await query('run', makeNewUser, [ login, email, hashedPassword ]);

        return res.render('auth/login');
    } catch(error) {
        console.log(error);

        return res.render('auth/register', { error });
    }
}


exports.codePage = (req, res) => res.render('auth/code');


exports.codeHandle = async (req, res) => { 
    const { email } = req.body;
    
    const findUser = 'SELECT id_klienta FROM klienci WHERE email = ?;';

    try {
        const user = await query('single', findUser, [ email ]);

        if (!user) throw `Nie odnaleziono użytkownika o podanym e-mail'u.`;

        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

        req.session.reset = { code: verificationCode, id: user.id_klienta };

        return res.redirect('/auth/reset');
    } catch(error) {
        console.log(error);

        return res.render('auth/code', { error });
    }
}


exports.resetPage = (req, res) => { 
    if (!req.session && !req.session.reset) return res.redirect('/auth/code');

    return res.render('auth/reset', { code : req.session.reset.code });
}


exports.resetHandle = async (req, res) => { 
    const { code : input, password } = req.body;
    const { code, id } = req.session.reset;

    const changePassword = 'UPDATE klienci SET haslo = ? WHERE id_klienta = ?;';

    try {
        if (input != code) throw 'Podano nieprawidłowy kod.';

        const hashedPassword = await bcrypt.hash(password, 10);

        await query('run', changePassword, [ hashedPassword, id ]);

        req.session.destroy();

        return res.redirect('/auth/login');
    } catch(error) {
        console.log(error);

        return res.render('auth/reset', { code, error });
    }
}