const bcrypt = require('bcrypt');
const saltRounds = parseInt(process.env.SALT_ROUNDS);
const userModel = require('../models/userModel');
const bookModel = require("../models/bookModel");

exports.getUserDetails = async (userId) => {
    try {
        const user = await userModel.selectUserDetails(userId);

        if (!user) throw 'Nie odnaleziono klienta';

        return user;
    } catch(error) {
        throw error;
    }
}

exports.loginUser = async (email, password) => {
    try {
        const user = await userModel.selectUserAND('id_klienta, login, haslo', { 'email' : email });

        if (!user) throw 'Nie ma takiego użytkownika.'; 

        const match = await bcrypt.compare(password, user.haslo);
        
        if (!match) throw 'Nieprawidłowy e-mail lub hasło.';

        delete user.haslo;

        const { data : cart, count : cartAmount } = await userModel.count('koszyk', user.id_klienta);
        const { data : favorites, count : favoritesAmount } = await userModel.count('ulubione_ksiazki', user.id_klienta);

        user.cartIds = cart.map(item => item.id_ksiazki);
        user.favIds = favorites.map(item => item.id_ksiazki);

        user.cart = cartAmount;
        user.favorites = favoritesAmount;
 
        return user;
    } catch (error) {
        throw error;
    }
};

exports.registerUser = async ({ login, email, haslo }) => {
    try { 
        const data = await userModel.selectUserOR('id_klienta', login, email);

        if (data) throw 'Użytkownik z takim loginem lub e-mailem już istnieje.';

        const hashedPassword = await bcrypt.hash(haslo, saltRounds);

        const user = await userModel.setUser({ login, email, haslo : hashedPassword });

        if (!user) throw 'Nie udało się pobrać użytkownika po dodaniu do bazy';

        return null;
    } catch (error) {
        throw error;
    }
};

exports.getCartBooks = async (userId) => {
    try {
        const books = await bookModel.selectCartBooks(userId);

        if (!books) throw 'Problem podczas pobierania książek z koszyka';

        return books;
    } catch(error) {
        throw error;
    }
}

exports.getFavoritesBooks = async (userId) => {
    try {
        const books = await bookModel.selectFavoriteBooks(userId);

        if (!books) throw 'Problem podczas pobierania ulubionych książek';

        return books;
    } catch(error) {
        throw error;
    }
}

exports.createResetSession = async (email) => {
    try {    
        const user = await userModel.selectUserAND('id_klienta', { 'email' : email });
        
        if (!user) throw "Nie znaleziono takiego e-maila.";

        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        
        return { code : verificationCode, user : user.id_klienta };
    } catch (error) {
        throw error;
    }
};

exports.resetPassword = async (inputBody, inputSession) => {
    const { resetCode, newPassword } = inputBody;
    const { resetData } = inputSession;

    try {
        if (resetCode != resetData.code) throw 'Wpisano nieprawidłowy kod.';

        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        const user = await userModel.updateUserData( { haslo: hashedPassword }, resetData.user);

        if (!user) throw 'Błąd podczas pobierania użytkownika po aktulizacji danych';

        return user;
    } catch (error) {
        throw error;
    }
};

exports.getUserBookById = async (body, user) => {
    const { id_ksiazki, userItem, path, ids } = body;
    const { id_klienta } = user;

    try {
        const book = await bookModel.selectUserBookById(path, id_ksiazki, id_klienta);

        let status;

        if (!book) {
            await bookModel.setUserBookById(path, { id_ksiazki, id_klienta, posiadane: true });
            
            user[ids].push(id_ksiazki);
            
            status = true;
        } else {
            const nowOwned = !book.posiadane;
            
            await bookModel.updateUserBookById(path, { 'posiadane' : nowOwned }, { 'id_ksiazki' : book.id_ksiazki, 'id_klienta' : id_klienta });

            if (nowOwned) user[ids].push(book.id_ksiazki);
            else user[ids] = user[ids].filter(bookId => bookId !== book.id_ksiazki);

            status = nowOwned;
        }

        user[userItem] += status ? 1 : -1;

        return { status, count: user[userItem] };
    } catch (error) {
        throw error;
    }
};

exports.updateCartAmount = async (body, user) => {
    const { id, ilosc } = body;
    const { id_klienta } = user;

    try {
        await bookModel.updateUserBookById('koszyk', { ilosc }, { 'id_ksiazki' : id, 'id_klienta' : id_klienta });

        return null;
    } catch(error) {
        throw error;
    }
}

exports.removeUserCart = async (body, user) => {
    const { id } = body;
    const { id_klienta } = user;

    try {
        await bookModel.updateUserBookById('koszyk', { 'posiadane' : false, 'ilosc' : 1}, { 'id_ksiazki' : id, 'id_klienta' : id_klienta });

        user.cartIds = user.cartIds.filter(bookId => bookId != id);
        user.cart -= 1;

        return { ids : user.cartIds, cart : user.cart };
    } catch(error) {
        throw error;
    }
}