var config = require(CONFIG_FILE);

var net = require('net');
var repl = require('repl');

var repl_base = require('./repl');

var Event = {
    start: 'repl_server.start',
    stop: 'repl_server.stop'
}

exports.Event = Event;

exports.create = function(emitter) {

    var repl_server;
    var context;

    var started = false;

    // create a remote repl
    var server = net.createServer(function(socket) {
        var remote = repl.start(config.repl.prompt, socket);

        context = remote.context;

        // register server in repl
        repl_base.setCommands(remote.context);
    });

    function start() {
        server.listen(config.repl_server.port, config.global.address);
        started = true;
        emitter.emit(Event.start, repl_server);
        console.info("Remote REPL listening on port " +
            config.repl_server.port);
    }

    function stop() {
        server.close();
        started = false;
        emitter.emit(Event.stop, repl_server);
        console.info("Remote REPL on port " +
            config.repl_server.port + " closed");
    }

    function isRunning() {
        return started;
    }

    repl_server = {
        start: start,
        stop: stop,
        isRunning: isRunning,
        context: context
    }

    return repl_server;

};
