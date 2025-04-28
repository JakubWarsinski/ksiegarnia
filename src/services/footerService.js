const { getEmail, SetEmail } = require("../models/newsletterModel");

exports.addEmailToNewsletter = async (email) => {
    try {
        if (await getEmail(email)) {
            throw 'Ten email już jest zapisany.';
        }

        if (!await SetEmail(email)) {
            throw 'Nie udało się zapisać emaila.';
        }

        return 'Zapisano newslettera.';
    } catch(error) {
        throw error;
    }
};