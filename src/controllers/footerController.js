const { query } = require('../utils/queryHelper');


exports.helpPage = (req, res) => res.render('footer/help');


exports.contactPage = (req, res) => res.render('footer/contact');


exports.conditionsPage = (req, res) => res.render('footer/conditions');


exports.newsletterHandle = async (req, res) => {
    const { email } = req.body;

    const findEmail = 'SELECT id_newslettera FROM newslettery WHERE email = ?;';

    const putNewEmail = 'INSERT INTO newslettery(email) VALUES (?);';
    
    try {
        const getEmail = await query('single', findEmail, [ email ]);

        if (getEmail) throw 'Ten email jest już zapisany.';

        await await query('run', putNewEmail, [ email ]);

        return res.status(200).json('Zapisano newslettera.');
    } catch (error) {
        console.log(error);

        return res.status(500).json(error);
    }
};