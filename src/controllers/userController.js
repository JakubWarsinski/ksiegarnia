const queryHelper = require('../utils/queryHelper');
const { formatDate } = require('../utils/formatDate');
const { query } = require('../utils/queryHelper');

exports.dashboardPage = (req, res) => res.render('user/dashboard');


exports.contactPage = async (req, res) => {
    const { id } = req.session.user;
    
    const getUserInfo = `
        SELECT imie, nazwisko, nr_telefonu, miejscowosc, ulica, nr_mieszkania, nr_lokalu, kod_pocztowy 
        FROM klienci 
        WHERE id_klienta = ?;`;

    let dataMap = { 
        imie : '', 
        nazwisko : '', 
        nr_telefonu : '', 
        miejscowosc : '', 
        ulica : '', 
        nr_mieszkania : '', 
        nr_lokalu : '', 
        kod_pocztowy : '',
        code : ['', '']
    }

    try {
        const userData = await query('single', getUserInfo, [ id ]);

        for (const element in dataMap) {
            const item = userData[element];

            if (item) {
                if (element == 'kod_pocztowy') {
                    const codeSlice = item.split('-');

                    dataMap.kod_pocztowy = item;
                    dataMap.code = [codeSlice[0], codeSlice[1]];

                    break;
                }
                
                dataMap[element] = item;
            }
            else continue;
        }

        return res.render('user/contact', { dataMap });
    } catch(error) {
        console.log(error);

        return res.render('user/contact', { error });
    }   
}


exports.contactHandle = async (req, res) => { 
    const { name, surname, phone, city, street, home, door, code } = req.body;
    const { id } = req.session.user;

    const update = 'UPDATE klienci SET imie = ?, nazwisko = ?, nr_telefonu = ?, miejscowosc = ?, ulica = ?, nr_mieszkania = ?, nr_lokalu = ?, kod_pocztowy = ? WHERE id_klienta = ?;';

    try {
        await query('run', update, [ name, surname, phone, city, street, home, door, code, id ]);

        return res.redirect('/user/dashboard');
    } catch(error) {
        console.log(error);

        return res.render('user/contact', { error });
    }
}


exports.orderListPage = async (req, res) => { 
    const { id } = req.session.user;

    const count = `
        SELECT COUNT(id_klienta) as ilosc
        FROM zamowienia
        WHERE id_klienta = ?;`;

    try {
        const order = await query('single', count, [ id ]);

        return res.render('user/order_list', { order : order.ilosc }); 
    } catch(error) {
        console.log(error);

        return res.render('user/order_list'); 
    }
}


exports.orderPage = async (req, res) => { 
    const { id_zamowienia } = req.params;

    const selectData = `
        SELECT 
            zm.id_zamowienia, 
            ds.nazwa as dostawa, 
            pl.nazwa as platnosc, 
            zm.cena, 
            zm.miejscowosc, 
            zm.ulica, 
            zm.nr_mieszkania, 
            zm.nr_lokalu, 
            zm.kod_pocztowy, 
            zm.data_utworzenia
        FROM zamowienia zm
        JOIN dostawy ds ON ds.id_dostawy = zm.id_dostawy
        JOIN platnosci pl ON pl.id_platnosci = zm.id_platnosci
        WHERE id_zamowienia = ?;`;

    try {
        const orderData = await query('single', selectData, [ id_zamowienia ]);

        orderData.data_utworzenia = formatDate(orderData.data_utworzenia);

        let destiny = `${orderData.miejscowosc}, ul.${orderData.ulica} ${orderData.nr_mieszkania}`;

        if (orderData.nr_lokalu) destiny += `/${orderData.nr_lokalu}`;

        destiny += `, ${orderData.kod_pocztowy}`;

        orderData.destiny = destiny;

        return res.render('user/order', { orderData });
    } catch(error) {
        console.log(error);

        return res.render('user/order');
    }
}


exports.cartPage = async (req, res) => { 
    const { id } = req.session.user;
    
    const select = `
        SELECT ks.cena, sh.ilosc
        FROM ksiazki ks
        JOIN schowek sh ON sh.id_ksiazki = ks.id_ksiazki
        WHERE id_klienta = ? AND posiadane = 1 AND czy_koszyk = 1;`;

    try {
        const books = await query('all', select, [ id ]);
        const length = books.length - 1;

        let price = 0;

        for (let i = 0; i <= length; i++) {
            const bookPrice = parseFloat(books[i].cena);
            const bookAmount = parseInt(books[i].ilosc, 10);

            const total = bookPrice * bookAmount;
            
            price += total;
        }
        
        const finalPrice = price.toFixed(2);

        return res.render('user/cart', { price : finalPrice });
    } catch(error) {
        console.log(error);

        return res.render('user/cart');
    }
}


exports.favoritesPage = async (req, res) => res.render('user/favorites');


exports.paymentPage = async (req, res) => { 
    const { id } = req.session.user;

    const getUserInfo = 'SELECT imie, nazwisko, nr_telefonu, miejscowosc, ulica, nr_mieszkania, nr_lokalu, kod_pocztowy FROM klienci WHERE id_klienta = ?;';

    let dataMap = { 
        imie : '', 
        nazwisko : '', 
        nr_telefonu : '', 
        miejscowosc : '', 
        ulica : '', 
        nr_mieszkania : '', 
        nr_lokalu : '', 
        kod_pocztowy : '',
        code : ['', '']
    }

    const checkFinalePrice = `
        SELECT ks.cena, sh.ilosc
        FROM ksiazki ks
        JOIN schowek sh ON sh.id_ksiazki = ks.id_ksiazki
        WHERE id_klienta = ? AND posiadane = 1 AND czy_koszyk = 1;`

    const deliveryOptions = 'SELECT id_dostawy, nazwa, opis, cena, czas FROM dostawy;';

    const paymentOptions = 'SELECT id_platnosci, nazwa, ikona FROM platnosci;';

    try {
        const userData = await query('single', getUserInfo, [ id ]);

        for (const element in dataMap) {
            const item = userData[element];

            if (item) {
                if (element == 'kod_pocztowy') {
                    const codeSlice = item.split('-');

                    dataMap.kod_pocztowy = item;
                    dataMap.code = [codeSlice[0], codeSlice[1]];

                    break;
                }
                
                dataMap[element] = item;
            }
            else continue;
        }

        const payment = await query('all', paymentOptions, []);
        const delivery = await query('all', deliveryOptions, []);
        const books = await query('all', checkFinalePrice, [ id ]);
        
        const length = books.length - 1;

        let price = 0;

        for (let i = 0; i <= length; i++) {
            const bookPrice = parseFloat(books[i].cena);
            const bookAmount = parseInt(books[i].ilosc, 10);

            const total = bookPrice * bookAmount;
            
            price += total;
        }
        
        const finalPrice = price.toFixed(2);

        req.session.price = finalPrice;

        return res.render('user/payment', { userData, payment, delivery, finalPrice });
    } catch(error) {
        console.log(error);

        return res.render('user/payment', { error });
    }
}

exports.paymentHandle = async (req, res) => { 
    const { id } = req.session.user;

    const price = req.session.price;

    const { miejscowosc, ulica, nr_mieszkania, nr_lokalu, kod_pocztowy, delivery, payment } = req.body;
    
    const setNewOrder = `
        INSERT INTO zamowienia(id_klienta, id_dostawy, id_platnosci, cena, miejscowosc, ulica, nr_mieszkania, nr_lokalu, kod_pocztowy)
        VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?);`;

    const selectBooksFromStorage = `
        SELECT sh.id_ksiazki, sh.ilosc, ks.cena 
        FROM schowek sh
        JOIN ksiazki ks ON ks.id_ksiazki = sh.id_ksiazki
        WHERE id_klienta = ? AND czy_koszyk = 1 AND posiadane = 1;`;

    const deleteBooksFromStorage = 'UPDATE schowek SET posiadane = -1, ilosc = 1 WHERE id_klienta = ? AND czy_koszyk = 1;';

    const putNewBook = 'INSERT INTO zamowienia_ksiazki(id_ksiazki, id_zamowienia, ilosc, cena) VALUES(?, ?, ?, ?);';

    try {
        const order = await query('run', setNewOrder, [ id, delivery, payment, price, miejscowosc, ulica, nr_mieszkania, nr_lokalu, kod_pocztowy]);
        const books = await query('all', selectBooksFromStorage, [ id ]);
        
        await query('run', deleteBooksFromStorage, [ id ]);

        const length = books.length - 1;

        for (let i = 0; i <= length; i++) {
            const book = books[i];

            await query('run', putNewBook, [ book.id_ksiazki, order, book.ilosc, book.cena ]);
        }

        req.session.user.car = [];
        req.session.user.carAmount = 0;
        
        return res.redirect('/user/dashboard');
    } catch(error) {
        console.log(error);

        return res.render('user/dashboard', { error });
    }
}


exports.logoutPage = (req, res) => {
    req.session.destroy(error => {
        return res.redirect('/auth/login');
    });
};