const bcrypt = require('bcrypt');
const { GetUser, GetCount, SetUser, UpdateUserData } = require('../models/userModel');
const { GetUserBookById, SetUserBookById, UpdateUserBookById, GetBooksById } = require('../models/bookModel');
const saltRounds = parseInt(process.env.SALT_ROUNDS);

exports.loginUser = async (email, password) => {
    try {
        const user = await GetUser('id_klienta, login, haslo', { 'email' : email });

        if (!user) { 
            throw 'Nie ma takiego użytkownika.'; 
        };

        const match = await bcrypt.compare(password, user.haslo);
        
        if (!match) { 
            throw 'Nieprawidłowy e-mail lub hasło.'; 
        }

        delete user.haslo;

        const { data : cart, count : cartAmount } = await GetCount('koszyk', user.id_klienta);
        const { data : favorites, count : favoritesAmount } = await GetCount('ulubione_ksiazki', user.id_klienta);

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
        const data = await GetUser('id_klienta', { 'login' : login, 'email' : email }, true);

        if (data) {
            throw 'Użytkownik z takim loginem lub e-mailem już istnieje.';
        }

        const hashedPassword = await bcrypt.hash(haslo, saltRounds);

        const user = await SetUser({login, email, haslo : hashedPassword});

        return user;
    } catch (error) {
        throw error;
    }
};

exports.createResetSession = async (email, session) => {
    try {    
        const user = await GetUser('id_klienta', { 'email' : email });
        
        if (!user) {
            throw "Nie znaleziono takiego e-maila.";
        }

        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        
        return { code : verificationCode, user : user.id_klienta };
    } catch (error) {
        throw error;
    }
};

exports.resetPassword = async (inputBody, inputSession) => {
    try {
        const { resetCode, newPassword } = inputBody;
        const { resetData } = inputSession;

        if (resetCode != resetData.code) {
            throw 'Wpisano nieprawidłowy kod.';
        }

        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        const user = await UpdateUserData({ haslo: hashedPassword }, resetData.user);

        return user;
    } catch (error) {
        throw error;
    }
};

exports.getUserBookById = async (body, user) => {
    try {
        const { id_ksiazki, userItem, path, ids } = body;
        const { id_klienta } = user;

        const book = await GetUserBookById(path, id_ksiazki);

        let status;

        if (!book) {
            await SetUserBookById(path, { id_ksiazki, id_klienta, posiadane: true });
            user[ids].push(book.id_ksiazki);
            status = true;
        } else {
            const nowOwned = !book.posiadane;
            await UpdateUserBookById(path, nowOwned, book.id_ksiazki);

            if (nowOwned) {
                user[ids].push(book.id_ksiazki);
            } else {
                user[ids] = user[ids].filter(bookId => bookId !== book.id_ksiazki);
            }

            status = nowOwned;
        }

        user[userItem] += status ? 1 : -1;

        return { status, count: user[userItem] };
    } catch (error) {
        throw error;
    }
};

exports.getPaymentParams = async (user) => {
    try {
        const { id_klienta } = user;

        const books = await GetBooksById(id_klienta);

        
    } catch (error) {

    }
}


/*
exports.createFacture = async (price) => {
    try {
        const facture = await createFacture(price);

        if (!facture) {
            return { error : `Bład przy tworzeniu faktury.`}
        }

        return { facture };
    } catch (error) {
        return { error: error.message };
    }
}

exports.createOrder = async (userId, factureId, deliveryId) => {
    try {
        const order = await createOrder(userId, factureId, deliveryId);

        if (!order) {
            return { error : `Bład przy tworzeniu zamówienia.`}
        }

        return { order };
    } catch (error) {
        return { error: error.message };
    }
}

exports.createOrderRelation = async (orderBooksData) => {
    try {
        const insertError = await createOrderRelation(orderBooksData);
        
        if (insertError) {
            return { error : `Błąd przy tworzeniu relacji pomięcy zamówieniem a książką`};
        }

        return {};
    } catch (error) {
        return { error: error.message };
    }
}
*/