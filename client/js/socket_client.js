var config = require('../../shared/js/config');

// BISON is in the global names space
var BISON = require('bison');
BISON = window.BISON;

// if user is running mozilla then use it's built-in WebSocket
window.WebSocket = window.WebSocket || window.MozWebSocket;

var Event = {
    close: 'socket_client.close',
    open: 'socket_client.open',
    send: 'send',
    message: 'message',
    error: 'socket_client.error'
};

exports.Event = Event;

exports.create = function(emitter) {
    var socket_client = {};
    var connection;

    socket_client.start = function() {
        var address =
            'ws://' + config.global.address + ':' + config.socket_server.port;
        console.info("Establishing connection with " + address);
        connection = new WebSocket(address);

        connection.onopen = function() {
            // register for sending
            emitter.on(Event.send, socket_client.send);

            console.info("Connection Established");
            emitter.emit(Event.open, socket_client, connection);
        };

        connection.onclose = function() {
            // unregister for sending
            emitter.removeListener(Event.send, socket_client.send);

            console.info("Connection closed");
            emitter.emit(Event.close, socket_client, connection);
        };

        connection.onerror = function(error) {
            // an error occurred when sending/receiving data
            console.error(error);
            emitter.emit(Event.error, error, socket_client, connection);
        };

        connection.onmessage = function (message) {
            // handle incoming message
            var data = BISON.decode(message.data);
            emitter.emit(Event.message, data, socket_client, connection);
        };
    };

    socket_client.stop = function() {
        connection.close();
    };

    socket_client.isRunning = function() {
        // ready state 3 is closed
        return (connection && connection.readyState === 3);
    }

    socket_client.send = function(data) {
        var message = BISON.encode(data);
        connection.send(message);
    }

    return socket_client;
};
