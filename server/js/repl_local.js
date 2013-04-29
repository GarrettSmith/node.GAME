var config = require(CONFIG_FILE);

exports.context = function() {
    if (local) return local.context;
};

var repl = require('repl');

var repl_base = require('./repl');

var local;

var exit_func = function() {
    process.exit(0);
};

// check if we already have a repl_local running
if (!local) {
    local = repl.start(config.repl.prompt);
    running = true;
}

// register server in repl
repl_base.setCommands(local.context);

// exit on REPL exit
if (config.repl_local.exit_on_repl_exit) {
    local.on('exit', exit_func);
} else {
    local.removeListener('end', exit_func);
}

