const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('temperature.db');

db.serialize(() => {
    db.run("CREATE TABLE temperature (date DATETIME, value REAL)");
});