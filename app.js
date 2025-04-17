require('dotenv').config();

const express = require('express');
const supabase = require('./supabaseClient');

const app = express();
const path = require('path');
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');

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
        lastChanceBooks: lastChance || [] 
    });
});

app.listen(port, () => {
    console.log(`Aplikacja działa na http://localhost:${port}`);
});