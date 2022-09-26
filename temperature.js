const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('temperature.db');

module.exports.save = (timestamp, temperature, humidity) => {
    const stmt = db.prepare("INSERT INTO temperature VALUES (?, ?, ?)");
    stmt.run(timestamp, temperature, humidity);
    stmt.finalize();
}

module.exports.findAll = async () => {
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM temperature ORDER BY timestamp ASC", (err, rows) => {
            if(err) {
                reject("Read error: " + err.message)
            } else {
                resolve(rows)
            }
        })
    });
}