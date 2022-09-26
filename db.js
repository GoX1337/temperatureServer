const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('temperature.db');

db.serialize(() => {
    db.run("CREATE TABLE temperature (timestamp DATETIME, temperature REAL, humidity REAL)");
    db.run("CREATE TABLE config (value TEXT)");
    var stmt = db.prepare("INSERT INTO config VALUES (?)");
    stmt.run("23;12;40;42;45;135");
    stmt.finalize();
});