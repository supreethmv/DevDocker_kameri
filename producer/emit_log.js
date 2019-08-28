var amqp = require('amqplib/callback_api');

var min=1,max=100;

amqp.connect('amqp://localhost', function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }
        var exchange = 'logs';
        //var msg = process.argv.slice(2).join(' ') || 'Hello World!';
        //var msg = {id:'Random Number',content:(Math.floor(Math.random() * (max - min)) + min)};

        channel.assertExchange(exchange, 'fanout', {
            durable: false
        });

        (function myLoop () {
           setTimeout(function () {
               var msg = {id:'Random Number',value:(Math.floor(Math.random() * (max - min)) + min)};
               channel.publish(exchange, '', Buffer.from(JSON.stringify(msg)));
               console.log(" [x] Sent %s", JSON.stringify(msg));
               myLoop();
            }, 500)
        })();

    });

    setTimeout(function() {
        connection.close();
        process.exit(0);
    }, 60000);
});
