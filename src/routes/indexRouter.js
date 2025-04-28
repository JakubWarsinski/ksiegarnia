const express = require("express");
const router = express.Router();
const indexController = require('../controllers/indexController');
const { sessionDataMiddleware } = require('../middlewares/sessionMiddleware');

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.use(sessionDataMiddleware);

router.get('/', indexController.showHomePage);
router.get('/genres', indexController.showGenres);
router.get('/authors', indexController.showAuthors);
router.get('/book/:id', indexController.showBook);

module.exports = router;
