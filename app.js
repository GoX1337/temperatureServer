const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const bodyParser = require('body-parser');
const temperatureDao = require('./temperature');
const configDao = require('./config');

app.use(bodyParser.json());   
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.post('/temperature', (req, res) => {
    console.log(req.body);
    const temperature = req.body.temperature;
    const humidity = req.body.humidity;
    const timestamp = new Date();
    temperatureDao.save(timestamp, temperature, humidity);
    let msg = {timestamp, temperature};
    io.emit("newtemp", msg);
    res.send("OK");
});

app.get('/temperature', async (req, res) => {
    const temperatures = await temperatureDao.findAll();
    res.send(temperatures);  
});

app.get('/config', async (req, res) => {
    const cfg = await configDao.get();
    res.send(cfg);
});

io.on('connection', (socket) => {
    console.log('socket client is connected');
});
  
server.listen(8080, () => {
    console.log("Server started listening on 8080...");
});