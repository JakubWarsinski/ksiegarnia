const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./src/database/bookstore.db');

exports.query = (type, sql, params = []) => {
    return new Promise((resolve, reject) => {
        switch (type) {
            case 'single':
                db.get(sql, params, (err, row) => err ? reject(err.message) : resolve(row));
                break;
            case 'all':
                db.all(sql, params, (err, rows) => err ? reject(err.message) : resolve(rows));
                break;
            case 'run':
                db.run(sql, params, function (err) {
                    if (err) reject(err.message);
                    else resolve(this.lastID);
                });
                break;
            default:
                reject(`Unknown query type: ${type}`);
        }
    });
};