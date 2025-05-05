const homeModel = require("../models/homeModel");

const render = {
    home: 'home/home',
    book: 'books/book_detail',
    genres: 'home/genres',
    authors: 'home/authors'
};

///////////////////////////////////
//             MAIN              //
///////////////////////////////////

exports.homePage = async (req, res) => {
    const params = req.query;
    
    try {
        if (params) {
            let searchedBooks = null;

            if (params.title) searchedBooks = await homeModel.selectBooks(null, {filter: [['ilike', 'tytul', `%${params.title}%`]]});
            if (params.genre) searchedBooks = await homeModel.selectBooks(null, {filter: [['eq', 'gatunki_ksiazki.id_gatunku', params.genre], ['not', 'gatunki_ksiazki', 'is', null]]});
            if (params.author) searchedBooks = await homeModel.selectBooks(null, {filter: [['eq', 'id_autora', params.author]]});

            if (searchedBooks) return res.render(render.home, { searchedBooks });
        }

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

        const topBooks = await homeModel.selectBooks(', data_dodania', {filter: [['gte', 'data_dodania', startOfMonth.toISOString()], ['lt', 'data_dodania', startOfNextMonth.toISOString()]]});
        const lastBooks = await homeModel.selectBooks(null, {filter: [['lte', 'ilosc_na_stanie', 10]]});
        const promotionBooks = await homeModel.selectBooks(null, {filter: [['not', 'promocja', 'is', null]]});

        return res.render(render.home, { topBooks, lastBooks, promotionBooks });
    } catch(error) {
        return res.render(render.home, { error });
    }
};

///////////////////////////////////
//            GENRES             //
///////////////////////////////////

exports.genresPage = async (req, res) => {
    try {
        const genres = await homeModel.selectItem('gatunki', 'id_gatunku, gatunek');

        if (!genres) throw 'Nie odnaleziono listy gatunków'; 

        return res.render(render.genres, { genres });
    } catch (error) {
        return res.render(render.genres, { error });
    }
};

///////////////////////////////////
//            AUTHORS            //
///////////////////////////////////

exports.authorsPage = async (req, res) => {
    try {
        const authors = await homeModel.selectItem('autorzy', 'id_autora, imie, nazwisko');

        if (!authors) throw 'Nie odnaleziono listy autorów'; 

        return res.render(render.authors, { authors });
    } catch (error) {
        return res.render(render.authors, { error });
    }
};

///////////////////////////////////
//          BOOK DETAILS         //
///////////////////////////////////

exports.bookPage = async (req, res) => {
    const { id } = req.params;
    
    try {
        const book = await homeModel.selectDetailedBook(id);

        if (!book) throw 'Nie odnaleziono książki'; 

        return res.render(render.book, { book });
    } catch (error) {
        return res.render(render.book, { error });
    }
};

///////////////////////////////////
//       ADD FAVORITE BOOK       //
///////////////////////////////////

exports.favoriteBookHandle = async (req, res) => {
    const { id_ksiazki } = req.body;
    const { id } = req.session.user;

    try {
        const book = await homeModel.selectBookToAdd('ulubione_ksiazki', id_ksiazki, id);

        if (!book) {
            await homeModel.insertBook('ulubione_ksiazki', { id_ksiazki, id_klienta: id, posiadane: true });

            req.session.user.favoriteAmount += 1;
            req.session.user.favoriteBooks.push(parseInt(id_ksiazki));
            
            return res.json({ status: true, amount : req.session.user.favoriteAmount });
        }

        const posiadane = !book.posiadane;

        await homeModel.updateBook('ulubione_ksiazki', { posiadane }, id_ksiazki, id);

        if (posiadane) {
            req.session.user.favoriteAmount += 1;
            req.session.user.favoriteBooks.push(book.id_ksiazki);
        } else {
            req.session.user.favoriteAmount -= 1;
            req.session.user.favoriteBooks = req.session.user.favoriteBooks.filter(bookId => bookId !== book.id_ksiazki);
        }

        return res.json({ status: posiadane, amount : req.session.user.favoriteAmount });
    } catch (error) {
        return res.render(render.book, { error });
    }
};

///////////////////////////////////
//         ADD CART BOOK         //
///////////////////////////////////

exports.cartBookHandle = async (req, res) => {
    const { id_ksiazki } = req.body;
    const { id } = req.session.user;

    try {
        const book = await homeModel.selectBookToAdd('koszyk', id_ksiazki, id);

        if (!book) {
            await homeModel.insertBook('koszyk', { id_ksiazki, id_klienta: id, posiadane: true });

            req.session.user.cartAmount += 1;
            req.session.user.cartBooks.push(parseInt(id_ksiazki));
            
            return res.json({ status: true, amount : req.session.user.cartAmount });
        }

        const posiadane = !book.posiadane;

        await homeModel.updateBook('koszyk', { posiadane }, id_ksiazki, id);

        if (posiadane) {
            req.session.user.cartAmount += 1;
            req.session.user.cartBooks.push(book.id_ksiazki);
        } else {
            req.session.user.cartAmount -= 1;
            req.session.user.cartBooks = req.session.user.cartBooks.filter(bookId => bookId !== book.id_ksiazki);
        }

        return res.json({ status: posiadane, amount : req.session.user.cartAmount });
    } catch (error) {
        return res.status(500).json(error);
    }
};

///////////////////////////////////
//     REMOVE FAVORITE BOOK      //
///////////////////////////////////

exports.removeFavoriteBookHandle = async (req, res) => {
    const { id_ksiazki } = req.body;
    const { id } = req.session.user;

    try {
        await homeModel.updateBook('ulubione_ksiazki', { posiadane : false }, id_ksiazki, id);
        
        req.session.user.favoriteAmount -= 1;
        req.session.user.favoriteBooks = req.session.user.favoriteBooks.filter(bookId => bookId !== parseInt(id_ksiazki));

        return res.json({ amount : req.session.user.favoriteAmount });
    } catch (error) {
        return res.status(500).json(error);
    }
};

///////////////////////////////////
//       REMOVE CART BOOK        //
///////////////////////////////////

exports.removeCartBookHandle = async (req, res) => {
    const { id_ksiazki } = req.body;
    const { id } = req.session.user;

    try {
        await homeModel.updateBook('koszyk', { posiadane : false, ilosc : 1 }, id_ksiazki, id);
        
        req.session.user.cartAmount -= 1;
        req.session.user.cartBooks = req.session.user.cartBooks.filter(bookId => bookId !== parseInt(id_ksiazki));

        return res.json({ amount : req.session.user.cartAmount });
    } catch (error) {
        return res.status(500).json(error);
    }
};