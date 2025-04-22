const express = require("express");
const supabase = require('../supabaseClient');
const bcrypt = require('bcrypt');
const router = express.Router();
const saltRounds = 10;

const { getUserByLogin, setNewUser } = require('../sql/user');

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

function isAuthenticated(req, res, next) {
    if (!req.session.user) {
        req.session.redirectTo = req.originalUrl;
        return res.redirect('/user');
    }

    next();
}

router.get('/', (req, res) => {
    if (req.session.user) {
        return res.render('login', { user: req.session.user });
    }

    return res.render('login', { error: null });
});

router.post('/', async (req, res) => {
    const { login, haslo } = req.body;

    const user = await getUserByLogin(login, '*');

    if (!user) {
        return res.render('login', { error: 'Nie ma takiego użytkownika' });
    }

    const match = await bcrypt.compare(haslo, user.haslo);

    if (!match) {
        return res.render('login', { error: 'Nieprawidłowy login lub hasło.' });
    }

    delete user.haslo;
    req.session.user = user;

    const redirectTo = req.session.redirectTo || '/';
    delete req.session.redirectTo;

    return res.redirect(redirectTo);
});

router.get('/new', (req, res) => {
    res.render('register', { error: null });
});

router.post('/new', async (req, res) => {
    const { login, imie, nazwisko, email, numer_telefonu, haslo } = req.body;

    const existingUser = await getUserByLogin(login, 'login');

    if (existingUser) {
        return res.render('register', { error: 'Użytkownik z takim loginem już istnieje.' });
    }

    const hashedPassword = await bcrypt.hash(haslo, saltRounds);

    const insertError = await setNewUser(login, hashedPassword, imie, nazwisko, email, numer_telefonu);

    if (insertError) {
        return res.render('register', { error: 'Wystąpił błąd przy tworzeniu konta.' });
    }

    const user = await getUserByLogin(login, '*');

    if (!user) {
        return res.render('register', { error: 'Rejestracja się udała, ale nie można było zalogować.' });
    }

    delete user.haslo;
    req.session.user = user;

    res.redirect('/');
});

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Błąd podczas wylogowania:', err);
            return res.status(500).send('Wystąpił problem z wylogowaniem');
        }

        res.redirect('/');
    });
});

router.get('/cart', isAuthenticated, (req, res) => {
    res.render('cart', { user: req.session.user });
});

router.get('/favorites', isAuthenticated, async (req, res) => {
    const { data } = await supabase.rpc('get_favorites_books', { id_input: req.session.user.id_klienta });

    res.render('favorites', { 
        data,
        user: req.session.user 
    });
});

router.post('/favorites', isAuthenticated, async (req, res) => {
    const { id_ksiazki } = req.body;
    const userId = req.session.userId;

    console.log(id_ksiazki);
    console.log(userId);
  
    const insertError = await AddBookToFavorites(userId, id_ksiazki);
    
    if (insertError) {
        return res.status(500).json({ error: 'Błąd serwera' })
    }

    return res.status(200).json({ message: 'Dodano do ulubionych' })
});

module.exports = router