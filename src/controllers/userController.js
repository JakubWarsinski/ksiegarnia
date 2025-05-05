const userModel = require('../models/userModel');
const homeModel = require('../models/homeModel');

const render = {
    cart : 'profile/cart',
    contact : 'profile/contact',
    dashboard : 'profile/dashboard',
    favorites : 'profile/favorites',
    orderList : 'profile/order_list',
    order : 'profile/order',
    pay : 'profile/pay'
}

///////////////////////////////////
//          DASHBOARD            //
///////////////////////////////////

exports.dashboardPage = (req, res) => {
    return res.render(render.dashboard);
};

///////////////////////////////////
//            ORDERS             //
///////////////////////////////////

exports.orderPage = async (req, res) => {
    const { id : bookId } = req.params;
    const { id : userId } = req.session.user;

    try {
        const order = await userModel.selectOrderDetails({ id_zamowienia : bookId, id_klienta : userId });

        return res.render(render.order, { order });
    } catch(error) {
        return res.render(render.order, { error });
    }
};

exports.orderListPage = async (req, res) => {
    const { id } = req.session.user;

    try {
        const orders = await userModel.selectOrdersWithFacture(id);

        return res.render(render.orderList, { orders });
    } catch(error) {
        return res.render(render.orderList, { error });
    }
};

///////////////////////////////////
//           FAVORITES           //
///////////////////////////////////

exports.favoritesPage = async (req, res) => {
    const { id } = req.session.user;
    
    try {
        const books = await userModel.selectFavoritesBooks(id);

        return res.render(render.favorites, { books });
    } catch (error) {
        return res.render(render.favorites, { error });
    }
};

///////////////////////////////////
//             CART              //
///////////////////////////////////

exports.cartPage = async (req, res) => {  
    const { id } = req.session.user;
    
    try {
        const books = await userModel.selectCartBooks(id);

        return res.render(render.cart, { books });
    } catch (error) {
        return res.render(render.cart, { error });
    }
};

exports.cartAmountHandle = async (req, res) => {  
    const { id_ksiazki, amount } = req.body;
    const { id } = req.session.user;

    try {
        if (!id) throw 'Musisz być zalogowany';

        const bookAmount = await homeModel.selectItemWithEq('koszyk', 'ilosc', { id_ksiazki, id_klienta : id });

        await homeModel.updateBook('koszyk', { 'ilosc' : (parseInt(amount) + bookAmount.ilosc)}, id_ksiazki, id);

        return res.json('Udało się');
    } catch(error) {
        return res.status(500).json(error);
    }
};

///////////////////////////////////
//            CONTACT            //
///////////////////////////////////

exports.contactPage = async (req, res) => {
    const { id } = req.session.user;
    
    try {
        const userInfo = await userModel.selectUserDetails(id);

        return res.render(render.contact, { userInfo });
    } catch(error) {
        return res.render(render.contact, { error });
    }
}

///////////////////////////////////
//            PAYMENT            //
///////////////////////////////////

exports.payPage = async (req, res) => {
    const { id } = req.session.user;
    
    try {
        return res.render(render.pay);
    } catch(error) {
        return res.render(render.pay, { error });
    }
}