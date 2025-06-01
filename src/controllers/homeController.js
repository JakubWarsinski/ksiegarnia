const { query } = require('../utils/queryHelper');


exports.homePage = async (req, res) => { 
    const select1 = 'SELECT COUNT(id_klienta) as ilosc FROM klienci';
    const select2 = 'SELECT COUNT(id_ksiazki) as ilosc FROM ksiazki';
    const select3 = 'SELECT COUNT(id_zamowienia) as ilosc FROM zamowienia';

    try {
        const users = await query('single', select1, []);
        const books = await query('single', select2, []);
        const orders = await query('single', select3, []);

        return res.render('home/home', {users, books, orders});
    } catch (error) {
        console.log(error);

        return res.render('home/home');
    }
}


exports.searchPage = async (req, res) => { 
    const { title, genre, author } = req.query;

    let where = question = '';

    if (title) {
        where = 'ks.tytul like';
        question = `%${title}%`;
    }
    
    if (genre) { 
        where = 'gt.id_gatunku =';
        question = genre;
    }
    
    if (author) { 
        where = 'au.id_autora =';
        question = author;
    }

    const getBooks = `
        SELECT ks.id_ksiazki, ks.tytul, ks.okladka, ks.cena, ks.ilosc_stron, ks.ilosc_na_stanie, au.imie, au.nazwisko, gt.nazwa, GROUP_CONCAT(gt.nazwa, ',') AS gatunki
        FROM ksiazki ks
        JOIN autorzy au ON au.id_autora = ks.id_autora
        JOIN gatunki_ksiazki gtk ON gtk.id_ksiazki = ks.id_ksiazki
        JOIN gatunki gt ON gt.id_gatunku = gtk.id_gatunku
        WHERE ${where} ?
        GROUP BY ks.id_ksiazki, ks.tytul, ks.okladka, au.imie, au.nazwisko;`;

    try {
        const books = await query('all', getBooks, [ question ]);

        return res.render('home/search', { books });
    } catch (error) {
        console.log(error);

        return res.render('home/search');
    }
}


exports.bookPage = async (req, res) => {
    const { bookId } = req.params;

    const getBookInfo = `
        SELECT ks.id_ksiazki, ks.tytul, ks.okladka, ks.opis, ks.cena, ks.ilosc_stron, ks.ilosc_na_stanie, au.imie, au.nazwisko, gt.nazwa, GROUP_CONCAT(gt.nazwa, ',') AS gatunki
        FROM ksiazki ks
        JOIN autorzy au ON au.id_autora = ks.id_autora
        JOIN gatunki_ksiazki gtk ON gtk.id_ksiazki = ks.id_ksiazki
        JOIN gatunki gt ON gt.id_gatunku = gtk.id_gatunku
        WHERE ks.id_ksiazki = ?
        GROUP BY ks.id_ksiazki, ks.tytul, ks.okladka, au.imie, au.nazwisko;`;

    try {
        const book = await query('single', getBookInfo, [ bookId ]);

        return res.render('home/book', { book });
    } catch (error) {
        console.log(error);

        return res.render('home/book');
    }
}


exports.genresPage = async (req, res) => { 
    const findGenres = 'SELECT id_gatunku, nazwa FROM gatunki;';

    try {
        const genres = await query('all', findGenres, []);

        return res.render('home/genres', { genres });
    } catch (error) {
        console.log(error);

        return res.render('home/genres');
    }
}


exports.authorsPage = async (req, res) => { 
    const findAuthors = 'SELECT id_autora, imie, nazwisko FROM autorzy;';

    try {
        const authors = await query('all', findAuthors, []);

        return res.render('home/authors', { authors });
    } catch (error) {
        console.log(error);

        return res.render('home/authors');
    }
}