const footerService = require('../services/footerService');

const paths = {
    help : 'footer/help',
    contact : 'footer/contact',
    conditions : 'footer/conditions',
}

///////////////////////////////////
//          GET METHOD           //
///////////////////////////////////

exports.helpPage = (req, res) => {
    return res.render(paths.help);
};

exports.conditionsPage = (req, res) => {
    return res.render(paths.conditions);
};

exports.contactPage = (req, res) => {
    return res.render(paths.contact);
};

///////////////////////////////////
//          POST METHOD          //
///////////////////////////////////

exports.newsletterHandle = async (req, res) => {
    const { email } = req.body;
    
    try {
        const message = await footerService.addEmailToNewsletter(email);

        return res.status(200).json(message);
    } catch (error) {
        return res.status(200).json(error);
    }
};
