const express = require('express');
const app = express.Router();
const userController = require('../controllers/userController');
const { isAuthenticated } = require('../middlewares/authMiddleware');
const { sessionDataMiddleware } = require('../middlewares/sessionMiddleware');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sessionDataMiddleware);

app.get('/cart', isAuthenticated, userController.cartPage);

app.get('/logout', isAuthenticated, userController.logoutPage);

app.get('/contact', isAuthenticated, userController.contactPage);
app.post('/contact', userController.contactHandle);

app.get('/dashboard', isAuthenticated, userController.dashboardPage);
app.get('/order_list', isAuthenticated, userController.orderListPage);
app.get('/favorites', isAuthenticated, userController.favoritesPage);
app.get('/order/:id_zamowienia', isAuthenticated, userController.orderPage);

app.get('/payment', isAuthenticated, userController.paymentPage);
app.post('/payment', userController.paymentHandle);

module.exports = app;