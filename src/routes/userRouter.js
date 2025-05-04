const express = require("express");
const router = express.Router();
const userController = require('../controllers/userController');
const { isAuthenticated } = require('../middlewares/authMiddleware');
const { sessionDataMiddleware } = require('../middlewares/sessionMiddleware');

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.use(sessionDataMiddleware);

///////////////////////////////////
//          GET METHOD           //
///////////////////////////////////

router.get('/', userController.loginPage);
router.get('/new', userController.registerPage);
router.get('/cart', isAuthenticated, userController.cartPage);
router.get('/forgot', userController.forgotPasswordPage);
router.get('/logout', isAuthenticated, userController.logoutPage);
router.get('/orders', isAuthenticated, userController.orderListPage);
router.get('/contact', isAuthenticated, userController.contactPage);
router.get('/favorites', isAuthenticated, userController.favoritesPage);

///////////////////////////////////
//          POST METHOD          //
///////////////////////////////////

router.post('/', userController.loginHandle);
router.post('/new', userController.registerHandle);
router.post('/forgot', userController.forgotPasswordHandle);
router.post('/reset', userController.resetPasswordHandle);
router.post('/add_item', userController.handleUserItem);
router.post('/update_cart', userController.cartUpdateHandle);
router.post('/remove_cart', userController.cartRemoveHandle);

module.exports = router;