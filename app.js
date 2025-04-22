require('dotenv').config();

const express = require('express');
const session = require('express-session');

const supabase = require('./supabaseClient');

const userRouter = require('./routes/user')
const footerRouter = require('./routes/footer')

const app = express();
const path = require('path');
const port = 3000;

app.use(session({
    secret: process.env.SESSION_COOKIES,
    resave: false,
    saveUninitialized: true,
    cookie: { 
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7 
    }
}));

app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.use('/user', userRouter)
app.use('/footer', footerRouter)

app.get('/', async (req, res) => {
    const { data : topBooks } = await supabase.rpc('get_top_books');
    const { data : lastBooks } = await supabase.rpc('get_last_books');
    const { data : promotionBooks } = await supabase.rpc('get_promotion_books');

    res.render('index', {
        topBooks: topBooks,
        lastBooks: lastBooks,
        promotionBooks: promotionBooks,
        user: req.session.user || null
    });
});

app.get('/book/:id', async (req, res) => {
    const bookId = req.params.id;

    const { data: book } = await supabase.rpc('get_book_by_id', { id_input: bookId }).maybeSingle();

    if (!book) {
        return res.status(404).send('Nie znaleziono książki');
    }

    const genre = book.gatunki.split(',').slice(0, 1);

    const { data: similarBooks } = await supabase.rpc('get_similar_books_by_genre', { gatunek: genre });

    res.render('book_detail', {
        book,
        similarBooks,
        user: req.session.user || null
    });
});

app.listen(port, () => {
    console.log(`Strona: http://localhost:${port}`);
});