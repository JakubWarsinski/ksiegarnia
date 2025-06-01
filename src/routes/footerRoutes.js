const express = require('express');
const app = express.Router();
const footerController = require('../controllers/footerController');
const { sessionDataMiddleware } = require('../middlewares/sessionMiddleware');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sessionDataMiddleware);

app.get('/help', footerController.helpPage);
app.get('/contact', footerController.contactPage);
app.get('/conditions', footerController.conditionsPage);

app.post('/newsletter', footerController.newsletterHandle);

module.exports = app;