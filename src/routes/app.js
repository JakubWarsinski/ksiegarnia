require('dotenv').config();

const express = require('express');
const session = require('express-session');

const app = express();
const path = require('path');
const port = process.env.PORT;

const authRouter = require('./authRouter');
const userRouter = require('./userRouter');
const homeRouter = require('./homeRouter');
const footerRouter = require('./footerRouter');
const sessionConfig = require('../config/sessionConfig');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../domains'));

app.use(session(sessionConfig));

app.use('/js', express.static(path.join(__dirname, '../static/js/')));
app.use('/css', express.static(path.join(__dirname, '../static/css/')));
app.use('/images', express.static(path.join(__dirname, '../static/images/')));

app.use('/auth', authRouter);
app.use('/footer', footerRouter);
app.use('/user', userRouter);
app.use('/home', homeRouter);

app.listen(port, () => {
    console.clear();
    console.log(`Strona: [ http://localhost:${port}/home ]`);
});
