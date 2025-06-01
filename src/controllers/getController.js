const { formatDate } = require('../utils/formatDate');
const { shortText } = require('../utils/shortText');
const { query } = require('../utils/queryHelper');


exports.getOrderList = async (req, res) => {
    const { id } = req.session.user;
    const { limit } = req.query;
    let pointer = parseInt(req.query.pointer);

    const getOrders = `
        SELECT zm.id_zamowienia, zm.cena, zm.data_utworzenia
        FROM zamowienia zm
        WHERE id_klienta = ?
        LIMIT ?, ?;`;

    try {
        const orders = await query('all', getOrders, [ id, pointer, limit ]);
        const length = orders.length - 1;

        for (let i = 0; i <= length; i++) {
            let order = orders[i];

            order.data_utworzenia = formatDate(order.data_utworzenia);
            order.index = pointer;

            pointer++;
        }

        res.render('partials/order_list_element_list', { orders });
    } catch(error) {
        console.log(error);

        res.render('partials/order_list_element_list', { orders : [] });
    }
}


exports.getOrder = async (req, res) => {
    const { limit, order_id } = req.query;
    let pointer = parseInt(req.query.pointer);

    const getOrder = `
        SELECT ks.id_ksiazki, ks.tytul, ks.okladka, ksz.cena as cena, ksz.ilosc as ilosc
        FROM ksiazki ks
        JOIN zamowienia_ksiazki ksz ON ksz.id_ksiazki = ks.id_ksiazki
        WHERE ksz.id_zamowienia = ?
        LIMIT ?, ?;`;

    try {
        let orders = await query('all', getOrder, [ order_id, pointer, limit ]);
        const length = orders.length - 1;

        for (let i = 0; i <= length; i++) {
            let order = orders[i];

            order.tytul = shortText(order.tytul, 35);
            order.index = pointer;

            pointer++;
        }

        res.render('partials/order_element_list', { orders });
    } catch(error) {
        console.log(error);

        res.render('partials/order_element_list', { orders : [] });
    }
}


exports.getFavorites = async (req, res) => {
    const { id } = req.session.user;
    const { limit } = req.query;
    let pointer = parseInt(req.query.pointer);

    const getCart = `
        SELECT ks.id_ksiazki, ks.tytul, ks.okladka, ks.cena, st.ilosc, st.id_schowka
        FROM ksiazki ks
        JOIN autorzy au ON au.id_autora = ks.id_autora
        JOIN gatunki_ksiazki gks ON gks.id_ksiazki = ks.id_ksiazki
        JOIN gatunki gt ON gt.id_gatunku = gks.id_gatunku
        JOIN schowek st ON st.id_ksiazki = ks.id_ksiazki
        WHERE st.id_klienta = ? AND st.posiadane = 1 AND st.czy_koszyk = ?
        GROUP BY ks.id_ksiazki, ks.tytul, ks.okladka, au.imie, au.nazwisko
        LIMIT ?, ?;`;

    try {
        const books = await query('all', getCart, [ id, -1, pointer, limit ]);
        const length = books.length - 1;

        for (let i = 0; i <= length; i++) {
            let book = books[i];

            book.tytul = shortText(book.tytul, 30);
            book.index = pointer;

            pointer++;
        }

        res.render('partials/favorites_element_list', { books });
    } catch(error) {
        console.log(error);

        res.render('partials/favorites_element_list', { books : [] });
    }
}


exports.getCart = async (req, res) => {
    const { id } = req.session.user;
    const { limit } = req.query;
    let pointer = parseInt(req.query.pointer);

    const getCart = `
        SELECT ks.id_ksiazki, ks.tytul, ks.okladka, ks.cena, st.ilosc, st.id_schowka
        FROM ksiazki ks
        JOIN autorzy au ON au.id_autora = ks.id_autora
        JOIN gatunki_ksiazki gks ON gks.id_ksiazki = ks.id_ksiazki
        JOIN gatunki gt ON gt.id_gatunku = gks.id_gatunku
        JOIN schowek st ON st.id_ksiazki = ks.id_ksiazki
        WHERE st.id_klienta = ? AND st.posiadane = 1 AND st.czy_koszyk = ?
        GROUP BY ks.id_ksiazki, ks.tytul, ks.okladka, au.imie, au.nazwisko
        LIMIT ?, ?;`;

    try {
        const books = await query('all', getCart, [ id, 1, pointer, limit ]);

        const length = books.length - 1;

        for (let i = 0; i <= length; i++) {
            let book = books[i];

            book.tytul = shortText(book.tytul, 30);
            book.index = pointer;

            pointer++;
        }

        res.render('partials/cart_element_list', { books });
    } catch(error) {
        console.log(error);

        res.render('partials/cart_element_list', { books : [] });
    }
}

exports.getSearchedBook = async (req, res) => {
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
        const books = await query('all', getBooks [ question ]);

        res.render('partials/search_element_list', { books });
    } catch(error) {
        console.log(error);

        res.render('partials/search_element_list', { books : [] });
    }
}