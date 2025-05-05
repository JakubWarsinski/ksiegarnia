const express = require("express");
const router = express.Router();
const authController = require('../controllers/authController');
const { isNotAuthenticated, isAuthenticated } = require('../middlewares/authMiddleware');

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

///////////////////////////////////
//          GET METHOD           //
///////////////////////////////////

router.get('/', authController.loginPage);
router.get('/new', isNotAuthenticated, authController.registerPage);
router.get('/forgot', authController.forgotPasswordPage);
router.get('/reset', authController.resetPasswordPage);
router.get('/logout', isAuthenticated, authController.logoutPage);

///////////////////////////////////
//          POST METHOD          //
///////////////////////////////////

router.post('/', authController.loginHandle);
router.post('/new', authController.registerHandle);
router.post('/forgot', authController.forgotPasswordHandle);
router.post('/reset', authController.resetPasswordHandle);

module.exports = router;