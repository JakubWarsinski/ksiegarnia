const footerModel = require("../models/footerModel");

const paths = {
    help : 'footer/help',
    contact : 'footer/contact',
    conditions : 'footer/conditions',
}

///////////////////////////////////
//            HELP               //
///////////////////////////////////

exports.helpPage = (req, res) => {
    return res.render(paths.help);
};

///////////////////////////////////
//          CONDITIONS           //
///////////////////////////////////

exports.conditionsPage = (req, res) => {
    return res.render(paths.conditions);
};

///////////////////////////////////
//           CONTACT             //
///////////////////////////////////

exports.contactPage = (req, res) => {
    return res.render(paths.contact);
};

///////////////////////////////////
//        ADD NEWSLETTER         //
///////////////////////////////////

exports.newsletterHandle = async (req, res) => {
    const { email } = req.body;
    
    try {
        if (await footerModel.getEmail(email)) throw 'Ten email jest już zapisany.';

        if (!await footerModel.setEmail(email)) throw 'Nie udało się zapisać emaila.';

        return res.status(200).json('Zapisano newslettera.');
    } catch (error) {
        return res.status(200).json(error);
    }
};
