var config = {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Température',
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: [
            ],
            fill: false,
        }]
    },
    options: {
        responsive: true,
        title: {
            display: false,
            text: 'Température'
        },
        tooltips: {
            mode: 'index',
            intersect: false,
        },
        hover: {
            mode: 'nearest',
            intersect: true
        },
        scales: {
            xAxes: [{
                display: false,
                scaleLabel: {
                    display: true,
                    labelString: 'Date'
                }
            }],
            yAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Température en °C'
                }
            }]
        }
    }
};

var socket = io();

window.onload = function() {
    console.log("onload");

    console.log(socket)
    socket.on('newtemp', (msg) => {
        console.log('newtemp', msg);
        config.data.labels.push(msg.date);
        config.data.datasets[0].data.push(msg.value);
        if(config.data.labels.length > 20){
            config.data.labels = config.data.labels.slice(-20);
            config.data.datasets[0].data = config.data.datasets[0].data.slice(-20);
        }
        window.myLine.update();
    });

    fetch("/temperature", {
        method: "GET"
    })
    .then(rep => rep.json())
    .then(rep => {
        console.log("GET");
        let data = [];
        let labels = [];
        rep.forEach(e => {
            data.push(e.value);
            labels.push(new Date(e.date).toJSON());
        });

        if(labels.length > 20){
            labels = labels.slice(-20);
            data = data.slice(-20);
        }

        config.data.labels = labels;
        config.data.datasets[0].data = data;
        var ctx = document.getElementById('myChart').getContext('2d');
        window.myLine = new Chart(ctx, config);
    })
    .catch(err => {
        console.log(err);
    });
};
