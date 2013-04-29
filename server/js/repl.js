exports.setCommands = setCommands;

function setCommands(context) {
    var core = require('./server').core;
    Object.keys(core).forEach(function(key) {
        context[key] = core[key];
    });
}