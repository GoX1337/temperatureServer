const express = require('express');
const app = express();
const server = require('http').createServer(app);
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('temperature.db');
const bodyParser = require('body-parser');
var io = require('socket.io')(server);

app.use(bodyParser.json());   
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.post('/temperature', (req, res) => {
    var stmt = db.prepare("INSERT INTO temperature VALUES (?, ?)");
    let d = new Date();
    let v = req.body.temperature;
    stmt.run(d, v);
    stmt.finalize();
    let msg = {date:d, value:v};
    console.log(req.body, msg);
    io.emit("newtemp", msg);
    res.send("OK");
});

app.get('/temperature', (req, res) => {
    db.all("SELECT * FROM temperature ORDER BY date ASC", (err, rows) => {
        if(err){
            res.status(500).send();
        } else {
            res.send(rows);
        }
    });
});

io.on('connection', (socket) => {
    console.log('socket client is connected');
});
  
server.listen(8080, () => {
    console.log("Server started listening on 8080...");
});