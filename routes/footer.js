const express = require("express");
const router = express.Router();

const { getEmail, setNewEmail } = require('../sql/footer');

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get('/conditions', (req, res) => {
    res.render('conditions', { user: req.session.user || null });
});

router.get('/help', (req, res) => {
    res.render('help', { user: req.session.user || null });
});

router.get('/contact', (req, res) => {
    res.render('contact', { user: req.session.user || null });
});

router.post('/newsletter', async (req, res) => {
    const { email } = req.body;

    const existingEmail = await getEmail(email);

    if (existingEmail) {
        return res.status(200).json({ message: 'Ten email już jest zapisany.' });
    }

    const insertError = await setNewEmail(email);

    if (insertError) {
        return res.status(500).json({ message: 'Błąd serwera.' });
    }

    return res.status(200).json({ message: 'Zapisano do newslettera!' });
});

module.exports = router