const express = require("express");
const router = express.Router();
const homeController = require('../controllers/homeController');
const { sessionDataMiddleware } = require('../middlewares/sessionMiddleware');

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.use(sessionDataMiddleware);

///////////////////////////////////
//          GET METHOD           //
///////////////////////////////////

router.get('/', homeController.homePage);
router.get('/genres', homeController.genresPage);
router.get('/authors', homeController.authorsPage);
router.get('/book/:id', homeController.bookPage);

///////////////////////////////////
//          POST METHOD          //
///////////////////////////////////

router.post('/add_cart', homeController.cartBookHandle);
router.post('/add_favorite', homeController.favoriteBookHandle);
router.post('/remove_cart', homeController.removeCartBookHandle);
router.post('/remove_favorite', homeController.removeFavoriteBookHandle);

module.exports = router;
