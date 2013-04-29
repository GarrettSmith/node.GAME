var web_config = require(CONFIG_FILE).web_server;

var static = require('node-static');
var http = require('http');

exports.create = function(emitter) {
    var running = false;

    var file = new static.Server('../../' + web_config.path);

    var server;

    function start() {
        if (!server) {
            server = http.createServer(function (request, response) {
                request.addListener('end', function () {
                    // Serve files
                    file.serve(request, response);
                });
            });
        }
        server.listen(web_config.port);
        running = true;
        emitter.emit('web_server.start');
        console.info("Web server serving \'%s\' opened on port %s",
            web_config.path, web_config.port);
    }

    function stop() {
        server.close();
        running = false;
        emitter.emit('web_server.stop');
        console.info("Web server on port %s closed", web_config.port);
    }

    function isRunning() {
        return running;
    }

    return {
        start: start,
        stop: stop,
        isRunning: isRunning
    };
};
