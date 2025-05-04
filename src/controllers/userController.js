const userService = require('../services/userService');

const paths = {
    user: 'profile/dashboard',
    login: 'customer/login',
    register: 'customer/register',
    cart: 'profile/cart',
    favorites: 'profile/favorites',
    forgot: 'customer/forgot',
    reset: 'customer/reset',
    pay: 'profile/pay',
    orderList: 'orders/order_list',
    contact: 'profile/contact'
};

///////////////////////////////////
//          GET METHOD           //
///////////////////////////////////

exports.registerPage = (req, res) => {
    return res.render(paths.register);
};

exports.forgotPasswordPage = (req, res) => {
    return res.render(paths.forgot);
};

exports.orderListPage = (req, res) => {
    return res.render(paths.orderList);
};

exports.loginPage = async (req, res) => {
    if (req.session.user) return res.render(paths.user);

    return res.render(paths.login);
};

exports.cartPage = async (req, res) => {  
    const { id_klienta } = req.session.user;
    
    try {
        const books = await userService.getCartBooks(id_klienta);

        return res.render(paths.cart, { books });
    } catch (error) {
        return res.render(paths.cart, { error });
    }
};

exports.favoritesPage = async (req, res) => {
    const { id_klienta } = req.session.user;
    
    try {
        const books = await userService.getFavoritesBooks(id_klienta);

        return res.render(paths.favorites, { books });
    } catch (error) {
        return res.render(paths.favorites, { error });
    }
};

exports.contactPage = async (req, res) => {
    const { id_klienta } = req.session.user;
    
    try {
        const userInfo = await userService.getUserDetails(id_klienta);

        return res.render(paths.contact, { userInfo });
    } catch(error) {
        return res.render(paths.contact, { error });
    }
}

exports.logoutPage = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.render(paths.login, { error : 'Problem z wylogowaniem.'})
        }
        return res.redirect('/home');
    });
};

///////////////////////////////////
//          POST METHOD          //
///////////////////////////////////

exports.loginHandle = async (req, res) => {    
    const { email, haslo } = req.body;
    
    try {
        const user = await userService.loginUser(email, haslo);

        req.session.user = user;

        const redirectTo = req.session.redirectTo || '/home';
        
        delete req.session.redirectTo;

        return res.redirect(redirectTo);
    } catch(error) {
        return res.render(paths.login, { error });
    }
};

exports.registerHandle = async (req, res) => { 
    const { login, email, haslo } = req.body;
    
    try {
        await userService.registerUser({ login, email, haslo });

        return res.redirect('/user');
    } catch (error) {
        return res.render(paths.register, { error });
    }
};

exports.forgotPasswordHandle = async (req, res) => {
    const { email } = req.body;
    
    try {
        const data = await userService.createResetSession(email);

        req.session.resetData = { code: data.code, user: data.user };

        return res.render(paths.reset, { code : data.code });
    } catch (error) {
        return res.render(paths.forgot, { error });
    }
};

exports.resetPasswordHandle = async (req, res) => {
    try {
        await userService.resetPassword(req.body, req.session);

        delete req.session.resetData;

        return res.redirect('/user');
    } catch (error) {
        const code = req.session.resetData.code;

        return res.render(paths.reset, { error, code });
    }
};

exports.handleUserItem = async (req, res) => {
    try {
        if (!req.session.user) throw 'Musisz być zalogowany.';

        const { status, count } = await userService.getUserBookById(req.body, req.session.user);

        return res.status(200).json({ status, count });
    } catch(error) {
        return res.status(500).json(error);
    }
};

exports.cartUpdateHandle = async (req, res) => {    
    try {
        if (!req.session.user) throw 'Musisz być zalogowany.';

        await userService.updateCartAmount(req.body, req.session.user);

        return res.json({ success: true });
    } catch(error) {
        res.status(500).json({ error: 'Błąd aktualizacji' });
    }
};

exports.cartRemoveHandle = async (req, res) => {    
    try {
        if (!req.session.user) throw 'Musisz być zalogowany.';

        const { ids, cart } = await userService.removeUserCart(req.body, req.session.user);

        req.session.user.cartIds = ids;
        req.session.user.cart = cart;

        return res.json({ success: true });
    } catch(error) {
        res.status(500).json({ error: 'Błąd aktualizacji' });
    }
};