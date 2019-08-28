let app = require('express')();
var server=require('http').Server(app);
var io=require('socket.io')(server);

var amqp = require('amqplib/callback_api');
const port = process.env.PORT || 3000;

io.on('connection',function(socket){
    console.log("A user connected");
    //amqp.connect('amqp://rabbitmq_service:5672', function(error0, connection) {
    //amqp.connect(process.env.AMQP_RECEIVE_URL, function(error0, connection) {
    amqp.connect('amqp://localhost:5672', function(error0, connection) {
    //amqp.connect(url, function(error0, connection) {
    if (error0) {
        console.log(error0);
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }
        var exchange = 'logs';

        channel.assertExchange(exchange, 'fanout', {
            durable: false
        });

        channel.assertQueue('', {
            exclusive: true
        }, function(error2, q) {
            if (error2) {
                throw error2;
            }
            console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q.queue);
            channel.bindQueue(q.queue, exchange, '');

            channel.consume(q.queue, function(msg) {
                if (msg.content) {
                    console.log(" [x] Received:  %s", msg.content.toString());
                    socket.emit('test_event',JSON.parse(msg.content.toString()).value);
                    console.log(" [XXX] Sent to Dashboard:  %s",JSON.parse(msg.content.toString()).value);
                }
            }, {
                noAck: true
            });
        });
        socket.on('disconnect',(reason)=>{
            console.log("A client Disconnected. Connection to RabbitMQ Closed. Reason:",reason);
            channel.close();
        });
    });

});
});


server.listen(3000,()=>{
    console.log(`Socket.io server is listening on port ${port}`);
});