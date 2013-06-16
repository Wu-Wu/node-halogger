//
// simple halogger client
//

var halogger = {};

halogger.HOST = 'halogger.example.com';
halogger.PORT = 30514;

var dgram = require('dgram');
// TODO
var message = new Buffer('test message');

var client = dgram.createSocket('udp4');
client.send(message, 0, message.length, halogger.PORT, halogger.HOST, function (err, bytes) {
    if (err)
        throw err;
    console.log('message sent to ' + halogger.HOST + ' udp/' + halogger.PORT);
    client.close();
});
