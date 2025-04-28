const bcrypt = require('bcrypt');
const { GetUser, GetCount, SetUser, UpdateUserData } = require('../models/userModel');
const { GetUserBookById } = require('../models/bookModel');
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

        user.cart = await GetCount('koszyk', user.id_klienta);
        user.favorites = await GetCount('ulubione_ksiazki', user.id_klienta);
 
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

exports.getUserBookById = async (id_ksiazki, id_klienta) => {
    try {
        const book = await GetUserBookById('ulubione_ksiazki', 'id_ksiazki', id_ksiazki);

        return book;
    } catch (error) {
        throw error;
    }
};




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