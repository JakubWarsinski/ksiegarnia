const express = require('express');
const session = require('express-session');

const app = express();
const path = require('path');

const getRouters = require('./src/routes/getRoutes');
const authRouters = require('./src/routes/authRoutes');
const userRouters = require('./src/routes/userRoutes');
const homeRouters = require('./src/routes/homeRoutes');
const footerRouters = require('./src/routes/footerRoutes');
const storageRouters = require('./src/routes/storageRoutes');

const sessionConfig = require('./src/config/sessionConfig');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './src/domains/'));

app.use(session(sessionConfig));

app.use('/static', express.static(path.join(__dirname, './src/static/')));

app.use('/get', getRouters);
app.use('/auth', authRouters);
app.use('/user', userRouters);
app.use('/home', homeRouters);
app.use('/footer', footerRouters);
app.use('/storage', storageRouters);

app.listen(3000, () => {
    console.clear();
    console.log(`Strona: [ http://localhost:3000/home ]`);
});