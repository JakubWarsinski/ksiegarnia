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

router.get('/dashboard', isAuthenticated, userController.dashboardPage)
router.get('/cart', isAuthenticated, userController.cartPage);
router.get('/orders', isAuthenticated, userController.orderListPage);
router.get('/orders/:id', isAuthenticated, userController.orderPage);
router.get('/contact', isAuthenticated, userController.contactPage);
router.get('/favorites', isAuthenticated, userController.favoritesPage);

///////////////////////////////////
//          POST METHOD          //
///////////////////////////////////

router.post('/cart_amount', userController.cartAmountHandle);

module.exports = router;