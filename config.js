const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('temperature.db');

module.exports.get = async () => {
    return new Promise((resolve, reject) => {
        db.get("SELECT * FROM config", (err, row) => {
            if(err) {
                reject("Read error: " + err.message)
            } else {
                resolve(row)
            }
        })
    });
}