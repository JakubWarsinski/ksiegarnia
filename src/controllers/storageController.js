const { query } = require('../utils/queryHelper');


exports.insertToStorage = async (req, res) => {
    const { userId } = req.session.user;
    const { bookId, isCart } = req.body;

    const addNewBook = 'INSERT INTO schowek(id_klienta, id_ksiazki, posiadane, czy_koszyk) VALUES (?, ?, ?, ?);';

    try {
        await query('run', addNewBook, [ userId, bookId, 1, isCart ]);

        res.status(200).json({ success: true });
    } catch(error) {
        console.log(error);

        return res.status(500).json({ error });
    }
}


exports.updateInStorage = async (req, res) => {
    const { storageId, decision, amount, type, ids, idsAmount } = req.body;

    const updateBook = 'UPDATE schowek SET posiadane = ?, ilosc = ? WHERE id_schowka = ?';

    try {
        await query('run', updateBook, [ decision, amount, storageId ]);

        req.session.user[type] = ids;
        req.session.user[`${type}Amount`] = idsAmount;

        res.status(200).json({ success: true });
    } catch(error) {
        console.log(error);

        return res.status(500).json({ error });
    }
}


exports.toggleStorage = async (req, res) => {
    const { bookId, amount, type, ids, idsAmount } = req.body;
    const { id } = req.session.user;

    const isCart = (type == 'car') ? 1 : -1;

    const findBook = 'SELECT id_schowka FROM schowek WHERE id_ksiazki = ? AND id_klienta = ? AND czy_koszyk = ?';
    const putNewBook = 'INSERT INTO schowek(id_ksiazki, id_klienta, posiadane, czy_koszyk, ilosc) VALUES(?, ?, ?, ?, ?)';
    const updateBook = 'UPDATE schowek SET posiadane = ? WHERE id_schowka = ?';

    try {
        const book = await query('single', findBook, [ bookId, id, isCart ]);

        if (book) await query('run', updateBook, [ amount, book.id_schowka ]);
        else await query('run', putNewBook, [ bookId, id, 1, isCart, 1 ]);

        req.session.user[type] = ids;
        req.session.user[`${type}Amount`] = idsAmount;

        res.status(200).json({ success: true });
    } catch(error) {
        console.log(error);

        return res.status(500).json({ error });
    }
}


exports.deleteFromStorage = async (req, res) => {
    const { storageId, type, ids, idsAmount } = req.body;

    const updateBook = 'UPDATE schowek SET posiadane = -1, ilosc = 1 WHERE id_schowka = ?';

    try {
        await query('run', updateBook, [ storageId ]);

        req.session.user[type] = ids;
        req.session.user[`${type}Amount`] = idsAmount;

        res.status(200).json({ success: true });
    } catch(error) {
        console.log(error);

        return res.status(500).json({ error });
    }
}