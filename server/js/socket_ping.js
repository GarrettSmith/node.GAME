var socket_server = require('./socket_server');

var Event = {
    send: socket_server.Event.send
}

exports.create = function(emitter) {

    var ping = {};
    var interval;

    var running = false;

    var ping = function() {
        emitter.emit(Event.send, {msg: "HELLO THERE!"});
    }

    ping.start = function() {
        running = true;
        interval = setInterval(ping, 1000);
    }

    ping.stop = function() {
        running = false;
        clearInterval(interval);
    }

    ping.isRunning = function() {
        return running;
    }


    return ping;
};