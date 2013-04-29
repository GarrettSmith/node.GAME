var socket_config = require(CONFIG_FILE).socket_server;

var BISON = require('bison');
var http = require('http');
var _ = require('underscore');
var ws_server = require('websocket').server;
var util = require('../../shared/js/util');

var Event = {
    start: 'socket_server.start',
    stop: 'socket_server.stop',
    connection_request: 'connection_request',
    connection_accept: 'connection_accept',
    connection_close: 'connection_close',
    message: 'message',
    send: 'send',
}

exports.Event = Event;

exports.create = function(emitter){

    var socket_server;

    var http_server = http.createServer();

    // create the server
    var server = new ws_server({
        httpServer: http_server
    });

    var connections = [];

    var running = false;

    // WebSocket server
    server.on('request', function(request) {
        emitter.emit(Event.connection_request, socket_server, request);
        var connection = request.accept(null, request.origin);

        connections.push(connection);
        console.info("Socket server: %s connected", request.origin);
        emitter.emit(Event.connection_accept, socket_server, connection);

        // This is the most important callback for us, we'll handle
        // all messages from users here.
        connection.on('message', function(message) {
            // recieve message
            var data = BISON.decode(message.utf8Data);
            emitter.emit(Event.message, socket_server, data, connection);
        });

        connection.on('close', function(connection) {
            // close user connection
            connections.pop(connection);
            console.info("Socket server: %s disconnected", request.origin);
            emitter.emit(Event.connection_close, socket_server, connection);
        });
    });

    function start() {
        http_server.listen(socket_config.port);
        running = true;
        emitter.emit(Event.start, socket_server);
        console.info("Socket server listening on port %s", socket_config.port);

        // register to send data
        emitter.on(Event.send, sendData);
    }

    function stop() {
        http_server.close();
        running = false;
        emitter.emit(Event.stop, socket_server);
        console.info("Socket server stopped on port %s", socket_config.port);

        // unregister sending
        emitter.removeListener(Event.send, sendData);
    }

    function isRunning() {
        return running;
    }

    function sendData(data, dests) {
        var message = BISON.encode(data);

        // check if destination is given otherwise send to all connectinos
        dests = util.optional(dests, connections);

        // wrap single connections in array to simplify code
        if (!_.isArray(dests)) {
            dests = [].concat(dests);
        }

        // send the message to each destination
        dests.forEach(function(dest) {
            dest.send(message);
        });

    }

    socket_server = {
        start: start,
        stop: stop,
        connections: connections,
        isRunning: isRunning
    };

    return socket_server;
};
