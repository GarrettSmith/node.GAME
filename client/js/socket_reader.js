var socket_client = require('./socket_client');

var Event = {
    message: socket_client.Event.message
}

exports.create = function(emitter) {
    var reader = {};

    var running = false;

    function read(data) {
        document.write('<p>' + data.msg.toString() + '</p>');
    }

    reader.start = function() {
        running = true;
        emitter.on(Event.message, read);
    }

    reader.stop = function() {
        running = false;
        emitter.removeListener(Event.message, read);
    }

    reader.isRunning = function() {
        return running;
    }

    return reader;
}