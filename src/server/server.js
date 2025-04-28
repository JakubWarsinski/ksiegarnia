require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();
const port = process.env.PORT;

const userRouter = require('../routes/userRouter');
const indexRouter = require('../routes/indexRouter');
const footerRouter = require('../routes/footerRouter');
const sessionConfig = require('../config/sessionConfig');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../domains'));

app.use(session(sessionConfig));

app.use('/home', express.static(path.join(__dirname, '../domains/home/static')));
app.use('/user', express.static(path.join(__dirname, '../domains/user/static')));
app.use('/books', express.static(path.join(__dirname, '../domains/books/static')));
app.use('/footer', express.static(path.join(__dirname, '../domains/footer/static')));
app.use('/header', express.static(path.join(__dirname, '../domains/header/static')));
app.use('/structure', express.static(path.join(__dirname, '../domains/structure/static')));

app.use('/footer', footerRouter);
app.use('/user', userRouter);
app.use('/home', indexRouter);

app.listen(port, () => {
    console.clear();
    console.log(`Strona: [ http://localhost:${port}/home ]`);
});
