const { getEmail, SetEmail } = require("../models/footerModel");

exports.addEmailToNewsletter = async (email) => {
    try {
        if (await getEmail(email)) {
            throw 'Ten email jest już zapisany.';
        }

        if (!await SetEmail(email)) {
            throw 'Nie udało się zapisać emaila.';
        }

        return 'Zapisano newslettera.';
    } catch(error) {
        throw error.message;
    }
};