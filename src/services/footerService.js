const footerModel = require("../models/footerModel");

exports.addEmailToNewsletter = async (email) => {
    try {
        if (await footerModel.getEmail(email)) throw 'Ten email jest już zapisany.';

        if (!await footerModel.setEmail(email)) throw 'Nie udało się zapisać emaila.';

        return 'Zapisano newslettera.';
    } catch(error) {
        throw error;
    }
};