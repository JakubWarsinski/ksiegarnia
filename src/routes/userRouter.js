const express = require("express");
const router = express.Router();
const userController = require('../controllers/userController');
const { isAuthenticated } = require('../middlewares/authMiddleware');
const { sessionDataMiddleware } = require('../middlewares/sessionMiddleware');

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.use(sessionDataMiddleware);

router.get('/', userController.showLoginPage);
router.post('/', userController.loginUser);

router.get('/new', userController.showRegisterPage);
router.post('/new', userController.registerUser);

router.get('/forgot', userController.showForgotPasswordPage);
router.post('/forgot', userController.handleForgotPassword);

router.post('/reset', userController.handleResetPassword);

router.get('/logout', isAuthenticated, userController.logoutUser);

router.get('/pay', isAuthenticated, userController.showPayPage);
router.post('/pay', isAuthenticated, userController.handlePay);

router.get('/cart', isAuthenticated, userController.showCartPage);
router.get('/favorites', isAuthenticated, userController.showFavoritesPage);

module.exports = router;
