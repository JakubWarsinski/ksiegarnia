require('dotenv').config();

const express = require('express');
const session = require('express-session');

const bcrypt = require('bcrypt');
const supabase = require('./supabaseClient');

const app = express();
const path = require('path');
const port = 3000;
const saltRounds = 10;

app.use(session({
    secret: process.env.SESSION_COOKIES,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

function isAuthenticated(req, res, next) {
    if (!req.session.user) {
        req.session.redirectTo = req.originalUrl;
        return res.redirect('/login');
    }
    next();
}


app.get('/', async (req, res) => {
    const { data: popular, error: popularError } = await supabase.rpc('get_books_by_popular');
    const { data: bestsellers, error: bestsellersError } = await supabase.rpc('get_books_by_bestsellers');
    const { data: lastChance, error: lastChanceError } = await supabase.rpc('get_books_by_last_chance');

    if (popularError || bestsellersError || lastChanceError) {
        if (popularError) console.log('Błąd zapytania:', popularError);
        if (bestsellersError) console.log('Błąd zapytania:', bestsellersError);
        if (lastChanceError) console.log('Błąd zapytania:', lastChanceError);
        return res.status(500).send('Błąd podczas pobierania danych');
    }

    if (!Array.isArray(popular) || !Array.isArray(bestsellers) || !Array.isArray(lastChance)) {
        console.log('Błąd: Jedno z zapytań nie zwróciło tablicy');
        return res.status(500).send('Błąd w strukturze danych');
    }

    res.render('index', { 
        popularBooks: popular || [], 
        bestsellersBooks: bestsellers || [], 
        lastChanceBooks: lastChance || [],
        user: req.session.user || null
    });
});

app.get('/login', (req, res) => {
    res.render('login', { error: null });
});

app.post('/login', async (req, res) => {
    const { login, haslo } = req.body;

    const { data: user, error } = await supabase
        .from('klienci')
        .select('*')
        .eq('login', login)
        .maybeSingle();

    if (error || !user) {
        return res.render('login', { error: 'Nieprawidłowy login lub hasło.' });
    }

    const match = await bcrypt.compare(haslo, user.haslo);
    if (!match) {
        return res.render('login', { error: 'Nieprawidłowy login lub hasło.' });
    }

    req.session.user = user;

    // 🔁 Sprawdź czy jest zapamiętany redirect
    const redirectTo = req.session.redirectTo || '/';
    delete req.session.redirectTo;

    res.redirect(redirectTo);
});

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Błąd podczas wylogowania:', err);
            return res.status(500).send('Wystąpił problem z wylogowaniem');
        }

        res.redirect('/');
    });
});

app.get('/register', (req, res) => {
    res.render('register', { error: null });
});

app.post('/register', async (req, res) => {
    const { login, imie, nazwisko, email, numer_telefonu, haslo } = req.body;

    const { data: existingUser, error: findError } = await supabase
        .from('klienci')
        .select('*')
        .or(`login.eq.${login},email.eq.${email}`)
        .maybeSingle();

    if (existingUser) {
        return res.render('register', { error: 'Użytkownik z takim loginem lub emailem już istnieje.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(haslo, saltRounds);

        const { error: insertError } = await supabase
            .from('klienci')
            .insert([{
                login,
                haslo: hashedPassword,
                imie,
                nazwisko,
                email,
                numer_telefonu
            }]);

        if (insertError) {
            console.error(insertError);
            return res.render('register', { error: 'Wystąpił błąd przy tworzeniu konta.' });
        }

        const { data: newUser, error: getUserError } = await supabase
            .from('klienci')
            .select('*')
            .eq('login', login)
            .maybeSingle();

        if (getUserError || !newUser) {
            console.error(getUserError || 'Brak danych');
            return res.render('register', { error: 'Rejestracja się udała, ale nie można było zalogować.' });
        }

        req.session.user = newUser;

        res.redirect('/');
    } catch (err) {
        console.error('Błąd rejestracji:', err);
        res.render('register', { error: 'Wewnętrzny błąd serwera.' });
    }
});

app.get('/cart', isAuthenticated, (req, res) => {
    res.render('cart', { user: req.session.user });
});

app.get('/favorites', isAuthenticated, (req, res) => {
    res.render('favorites', { user: req.session.user });
});

app.get('/conditions', (req, res) => {
    res.render('conditions', {user: req.session.user || null});
});

app.get('/help', (req, res) => {
    res.render('help', {user: req.session.user || null});
});

app.get('/contact', (req, res) => {
    res.render('contact', {user: req.session.user || null});
});

app.get('/user', isAuthenticated, (req, res) => {
    console.log('Session user:', req.session.user);
    res.render('user', { user: req.session.user });
});

app.get('/book/:id', async (req, res) => {
    const bookId = req.params.id;

    const { data, error } = await supabase.rpc('get_book_by_id', { book_id: bookId });

    if (error || !data || data.length === 0) {
        console.error('Błąd pobierania książki:', error);
        return res.status(404).send('Nie znaleziono książki');
    }

    const book = data[0];

    res.render('book_detail', {
        book,
        user: req.session.user || null
    });
});

app.post('/newsletter', async (req, res) => {
    const { email } = req.body;

    try {
        const { data, error } = await supabase
            .from('newsletter')
            .insert([{ email }]);

        if (error) {
            console.error(error);
        }

        res.redirect('/');
    }
    catch (err) {
        console.error('Błąd newslettera:', err);
    }
});



app.listen(port, () => {
    console.log(`Strona: http://localhost:${port}`);
});