const express = require('express');
const app = express.Router();
const getController = require('../controllers/getController');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/cart', getController.getCart);
app.get('/favorites', getController.getFavorites);
app.get('/order', getController.getOrder);
app.get('/order_list', getController.getOrderList);
app.get('/search', getController.getSearchedBook);

module.exports = app;