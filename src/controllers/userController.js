const userService = require('../services/userService');
const { currentDate } = require('../utils/currentDate');
const { userPaths } = require('../utils/userPaths');
const { GetUser } = require('../models/userModel');
const { GetUserBooks } = require('../models/bookModel');

exports.showLoginPage = async (req, res) => {
    if (req.session.user) {
        const userInfo = await GetUser('*', { 'id_klienta' : req.session.user.id_klienta });

        delete userInfo.haslo;
        delete userInfo.id_klienta;

        return res.render(userPaths.user, { userInfo });
    }

    return res.render(userPaths.login);
};

exports.loginUser = async (req, res) => {    
    try {
        const { email, haslo } = req.body;

        const user = await userService.loginUser(email, haslo);

        req.session.user = user;

        const redirectTo = req.session.redirectTo || '/home';
        
        delete req.session.redirectTo;

        return res.redirect(redirectTo);
    } catch(error) {
        return res.render(userPaths.login, { error });
    }
};

exports.showRegisterPage = (req, res) => {
    return res.render(userPaths.register);
};

exports.registerUser = async (req, res) => { 
    try {
        const { login, email, haslo } = req.body;

        const user = await userService.registerUser(
            { 
                login, 
                email,  
                haslo 
            });

        req.session.user = user;

        return res.redirect('/home');
    } catch (error) {
        return res.render(userPaths.register, { error });
    }
};

exports.logoutUser = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.render(userPaths.login, { error : 'Problem z wylogowaniem.'})
        }
        return res.redirect('/home');
    });
};

exports.showCartPage = async (req, res) => {  
    try {
        const books = await GetUserBooks('koszyk', req.session.user.id_klienta);

        return res.render(userPaths.cart, { books });
    } catch (error) {
        return res.render(userPaths.cart, { error });
    }
};

exports.showFavoritesPage = async (req, res) => {
    try {
        const books = await GetUserBooks('ulubione_ksiazki', req.session.user.id_klienta);

        return res.render(userPaths.favorites, { books });
    } catch (error) {
        return res.render(userPaths.favorites, { error });
    }
};

exports.showForgotPasswordPage = (req, res) => {
    res.render(userPaths.forgot);
};

exports.handleForgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const data = await userService.createResetSession(email, req.session);

        req.session.resetData = {
            code: data.code,
            user: data.user
        };

        return res.render(userPaths.reset, { code : data.code });
    } catch (error) {
        return res.render(userPaths.forgot, { error });
    }
};

exports.handleResetPassword = async (req, res) => {
    try {
        await userService.resetPassword(req.body, req.session);

        delete req.session.resetData;

        return res.redirect('/user');
    } catch (error) {
        const code = req.session.resetData.code;

        return res.render(userPaths.reset, { error, code });
    }
};






/*
exports.showPayPage = async (req, res) => {
    try {
        const delivery = await getDataByParams('dostawy', '*');
        const books = await getDataByFunction('get_books_from_cart', { input : res.locals.user.id_klienta});
        const userInfo = await getDataByParams('klienci', 'imie, nazwisko, ulica, numer_domu, numer_lokalu, kod_pocztowy, miejscowosc, numer_telefonu', { 'id_klienta' : res.locals.user.id_klienta })

        const bookCount = books.length;
        const totalPrice = books.reduce((sum, book) => sum + book.cena, 0);

        req.session.payData = { delivery, books, userInfo, bookCount, totalPrice};

        return res.render(userPaths.pay, { delivery, bookCount, totalPrice, userInfo });
    } catch (error) {
        return res.render(userPaths.pay, { error });
    }
};

exports.handlePay = async (req, res) => {
    try {
        const { imie, nazwisko, ulica, numer_domu, numer_lokalu, kod_pocztowy, miejscowosc, numer_telefonu, id_dostawy } = req.body;
        const { totalPrice, books } = req.session.payData;

        const user = await UpdateQueryWithParams('klienci', 
            { 
                'imie' : imie, 
                'nazwisko' : nazwisko, 
                'ulica' : ulica, 
                'numer_domu' : numer_domu, 
                'numer_lokalu' : numer_lokalu, 
                'kod_pocztowy' : kod_pocztowy, 
                'miejscowosc' : miejscowosc, 
                'numer_telefonu' : numer_telefonu 
            }, 
            { 'id_klienta' : res.locals.user.id_klienta }, 'id_klienta');

        const facture = await PostQueryWithParams('faktury', { 'data_wystawienia' : currentDate(), 'kwota' : totalPrice }, 'id_faktury');
        
        const order = await PostQueryWithParams('zamowienia', 
            { 
                'id_klienta' : user.id_klienta, 
                'id_faktury' : facture.id_faktury, 
                'id_dostawy' : id_dostawy,
                'data_zamowienia' : currentDate()
            }, 'id_zamowienia');

        const orderBooksData = books.map(book => ({
            'id_zamowienia': order.id_zamowienia, 
            'id_ksiazki': book.id_ksiazki
        }));

        const orderBooks = await PostQueryWithParams('zamowienia_ksiazki', orderBooksData);

        return res.redirect('/user/cart');
    } catch(error) {
        const { delivery, bookCount, totalPrice, userInfo } = req.session.payData;

        return res.render(userPaths.pay, { delivery, bookCount, totalPrice, userInfo, error });
    }

    


    /*

    const books = await userService.getBooksFromCart(res.locals.user.id_klienta);

    const totalPrice = books.reduce((sum, book) => sum + book.cena, 0);

    
    
    const order = await userService.createOrder(res.locals.user.id_klienta, facture.id_faktury, id_dostawy);

    if (!order) {
        return res.render('user/views/pay', { error : 'Nie można było dodać zamówienia' });
    }
    
    const orderBooks = books.map((book) => ({
        id_ksiazki: book.id_ksiazki,
        id_zamowienia: order.id_zamowienia
    }));

    const innerError = await userService.createOrderRelation(orderBooks);

    if (innerError) {
        return res.render('user/views/pay', { error: 'Nie można było dodać książek do zamówienia' });
    }
*/