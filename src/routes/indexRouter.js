const express = require("express");
const router = express.Router();
const indexController = require('../controllers/indexController');
const { sessionDataMiddleware } = require('../middlewares/sessionMiddleware');

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.use(sessionDataMiddleware);

///////////////////////////////////
//          GET METHOD           //
///////////////////////////////////

router.get('/', indexController.homePage);
router.get('/genres', indexController.genresPage);
router.get('/authors', indexController.authorsPage);
router.get('/book/:id', indexController.bookPage);

module.exports = router;
