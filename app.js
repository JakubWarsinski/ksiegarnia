require('dotenv').config();

const express = require('express');
const supabase = require('./supabaseClient');
const app = express();
const path = require('path');
const port = 3000;

// Serwowanie plików statycznych (np. pliki CSS)
app.use(express.static(path.join(__dirname, 'public')));

// Ustawienie EJS jako silnik szablonów
app.set('view engine', 'ejs');


app.get('/', async (req, res) => {
    // Wywołanie funkcji RPC w Supabase
    const { data: popular, error: popularError } = await supabase.rpc('get_books_by_popular');
    const { data: bestsellers, error: bestsellersError } = await supabase.rpc('get_books_by_bestsellers');
    const { data: lastChance, error: lastChanceError } = await supabase.rpc('get_books_by_last_chance');

    // Obsługa błędów
    if (popularError || bestsellersError || lastChanceError) {
        if (popularError) console.log('Błąd zapytania:', popularError);
        if (bestsellersError) console.log('Błąd zapytania:', bestsellersError);
        if (lastChanceError) console.log('Błąd zapytania:', lastChanceError);
        return res.status(500).send('Błąd podczas pobierania danych');
    }

    // Upewnij się, że odpowiedzi to tablice
    if (!Array.isArray(popular) || !Array.isArray(bestsellers) || !Array.isArray(lastChance)) {
        console.log('Błąd: Jedno z zapytań nie zwróciło tablicy');
        return res.status(500).send('Błąd w strukturze danych');
    }

    // Przekazanie wyników do EJS
    res.render('index', { 
        popularBooks: popular || [], 
        bestsellersBooks: bestsellers || [], 
        lastChanceBooks: lastChance || [] 
    });
});

// Uruchomienie serwera
app.listen(port, () => {
    console.log(`Aplikacja działa na http://localhost:${port}`);
});