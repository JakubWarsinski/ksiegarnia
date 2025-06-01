const express = require('express');
const app = express.Router();
const authController = require('../controllers/authController');
const { isNotAuthenticated } = require('../middlewares/authMiddleware');
const { sessionDataMiddleware } = require('../middlewares/sessionMiddleware');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sessionDataMiddleware);

app.get('/login', isNotAuthenticated, authController.loginPage);
app.post('/login', authController.loginHandle);

app.get('/register', isNotAuthenticated, authController.registerPage);
app.post('/register', authController.registerHandle);

app.get('/code', authController.codePage);
app.post('/code', authController.codeHandle);

app.get('/reset', authController.resetPage);
app.post('/reset', authController.resetHandle);

module.exports = app;