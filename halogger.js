//
// halogger server
//

var halogger = {};

halogger.HOST = 'halogger.example.com';
halogger.PORT = 30514;

var dgram  = require('dgram')
  , server = dgram.createSocket('udp4')
  , glossy = require('glossy').Parse;


server.on('listening', function () {
    var address = server.address();
    console.log('halogger server listening on ' + address.address + ' udp/' + address.port);
});

server.on('message', function (message, remote) {
    glossy.parse(message.toString('utf8', 0), function (data) {
        var parts   = data.message.split(' ', 9)
          , httpreq = data.message.match(/"(.* HTTP.*)"/)
          , reqstr  = httpreq[0].substr(1, httpreq[0].length - 2); // skip quotemarks "

        // console.log(parts[0]);
        console.log(reqstr);
    });
});

server.bind(halogger.PORT, halogger.HOST);
