const express = require("express");
const router = express.Router();
const footerController = require('../controllers/footerController');
const { sessionDataMiddleware } = require('../middlewares/sessionMiddleware');

router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use(sessionDataMiddleware);

///////////////////////////////////
//          GET METHOD           //
///////////////////////////////////

router.get('/help', footerController.helpPage);
router.get('/contact', footerController.contactPage);
router.get('/conditions', footerController.conditionsPage);

///////////////////////////////////
//          POST METHOD          //
///////////////////////////////////

router.post('/newsletter', footerController.newsletterHandle);

module.exports = router;