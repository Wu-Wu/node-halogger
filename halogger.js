//
// halogger server
//

var dgram  = require('dgram')
  , server = dgram.createSocket('udp4')
  , glossy = require('glossy').Parse
  , yaml   = require('js-yaml')
  , path   = require('path')
  , config = {}

try {
    config = require(path.normalize(__dirname + '/config.yml'))
}
catch (e) {
    console.log('error: failed to read config.yml');
    process.exit(1);
}

server.on('listening', function () {
    var address = server.address();
    console.log('halogger server listening on ' + address.address + ' udp/' + address.port);
});

server.on('message', function (message, remote) {
    glossy.parse(message.toString('utf8', 0), function (data) {
        var parts   = data.message.split(' ', 9)
          , reqstr  = data.message.match(/"(.* HTTP.*)"/)[0].slice(1, -1) // skip quotemarks "
          , _client = parts[0].split(':')  // client ipaddr and port
          , _req    = reqstr.split(' ')    // HTTP request
          , _srv    = parts[2].split('/')  // servers
          , _bytes  = parts[5].split('/')  // network activity
          , _timers = parts[3].split('/')  // request/response timers
          , _cconn  = parts[7].split('/')  // concurrent connections
          , _queue  = parts[8].split('/')  // queues

          , record  = {
                // request/response
                ts: toDateTime(parts[1]),                 // timestamp
                hm: _req[0],                              // HTTP method: GET|POST|PUT|..
                hu: _req[1],                              // uri
                hv: _req[2].substr(5),                    // HTTP version 1.0|1.1
                hc: parseInt(parts[4]),                   // HTTP response code
                // network activity
                rx: parseInt(_bytes[0]),                  // recieved bytes
                tx: parseInt(_bytes[1]),                  // sent bytes
                // servers (frontends, backends)
                sv: {
                    s: _srv[0].match(/~/) ? true : false, // (s)sl flag. check ~ (tilda) for HTTPS
                    f: _srv[0].replace(/~/g, ''),         // (f)rontend name. remove tilde
                    b: _srv[1],                           // (b)ackend name
                    i: _srv[2]                            // server (i)d
                },
                // client
                cl: {
                    a: _client[0],                        // ip (a)ddress
                    p: parseInt(_client[1])               // (p)ort
                },
                // timers
                tm: {
                    q: parseInt(_timers[0]),              // time to get the client request
                    w: parseInt(_timers[1]),              // time spent in the queues waiting for a connection slot
                    c: parseInt(_timers[2]),              // time to establish the TCP connection to the server
                    r: parseInt(_timers[3]),              // server response time
                    t: parseInt(_timers[4])               // session duration time
                },
                // session termination
                st: parts[6].split(''),
                // counters of the concurrent connections when session was logged
                cc: {
                    a: parseInt(_cconn[0]),               // on the process
                    f: parseInt(_cconn[1]),               // on the frontend
                    b: parseInt(_cconn[2]),               // handled by the backend
                    s: parseInt(_cconn[3]),               // still active on the server
                    r: parseInt(_cconn[4])                // number of connection retries experienced by this session
                },
                // queues: total number of requests which were processed before this one
                qu: {
                    s: parseInt(_queue[0]),               // in the server queue
                    b: parseInt(_queue[1])                // in the backend's global queue
                }
          }
        console.log(record);
    });
});

// convert "[16/Jun/2013:14:38:30.595]" into DateTime
function toDateTime (raw) {
    var ts = raw.match(/\[(\d{2})\/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\/(\d{4}):(\d{2}):(\d{2}):(\d{2}).(\d{1,3})\]/)
      , months = {
            'Jan': 0,
            'Feb': 1,
            'Mar': 2,
            'Apr': 3,
            'May': 4,
            'Jun': 5,
            'Jul': 6,
            'Aug': 7,
            'Sep': 8,
            'Oct': 9,
            'Nov': 10,
            'Dec': 11
        }

    return ts ? new Date(ts[3], months[ ts[2] ], ts[1], ts[4], ts[5], ts[6], ts[7]) : null;
}

server.bind(config.bind.port, config.bind.hostname);
