const express = require('express');
const app = express.Router();
const homeController = require('../controllers/homeController');
const { sessionDataMiddleware } = require('../middlewares/sessionMiddleware');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sessionDataMiddleware);

app.get('/', homeController.homePage);
app.get('/search', homeController.searchPage);
app.get('/genres', homeController.genresPage);
app.get('/authors', homeController.authorsPage);
app.get('/book/:bookId', homeController.bookPage);

module.exports = app;