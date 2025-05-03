const footerService = require('../services/footerService');

exports.showConditionsPage = (req, res) => {
    return res.render('footer/views/conditions');
};

exports.showHelpPage = (req, res) => {
    return res.render('footer/views/help');
};

exports.showContactPage = (req, res) => {
    return res.render('footer/views/contact');
};

exports.showNewsletterPage = (req, res) => {
    return res.render('footer/views/newsletter');
};

exports.handleNewsletter = async (req, res) => {
    const { email } = req.body;
    
    try {
        const message = await footerService.addEmailToNewsletter(email);

        return res.status(200).json(message);
    } catch (error) {
        return res.status(200).json(error);
    }
};
