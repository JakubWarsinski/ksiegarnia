const express = require("express");
const router = express.Router();
const footerController = require('../controllers/footerController');
const { sessionDataMiddleware } = require('../middlewares/sessionMiddleware');

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.use(sessionDataMiddleware);

router.get('/conditions', footerController.showConditionsPage);
router.get('/help', footerController.showHelpPage);
router.get('/contact', footerController.showContactPage);
router.get('/newsletter', footerController.showNewsletterPage);
router.post('/newsletter', footerController.handleNewsletter);

module.exports = router;