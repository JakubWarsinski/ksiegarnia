const express = require('express');
const app = express.Router();
const storageController = require('../controllers/storageController');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.put('/', storageController.updateInStorage);
app.put('/toggle', storageController.toggleStorage);

app.post('/', storageController.insertToStorage);

app.delete('/', storageController.deleteFromStorage);

module.exports = app;