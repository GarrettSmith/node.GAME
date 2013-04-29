var EventEmitter = require('events').EventEmitter;

var config = require('../../shared/js/config');

var core = require('../../shared/js/core').create();

// hack to get browser require working properly well still being fairly generic
// TODO prevent name collisions
function clientComponents() {
    return config.client.client_components;
}

function sharedComponents() {
    return config.client.shared_components;
}

function clientRequire(component) {
    return require('../../client/js/' + component);
}

function sharedRequire(component) {
    return require('../../shared/js/' + component);
}

function genericRequire(component, require_func) {
    try {
        core.add(component, require_func(component));
        console.info("Loaded \'%s\'", component);
    }
    catch(e) {
        console.error("Failed loading \'%s\'", component);
        console.error(e.toString());
    }
}

/**
 * Loads the given component, or all components defined in the settings file if
 * none is given.
 * @param  {[type]} component [description]
 */
core.load = function() {
    clientComponents().forEach(function(component) {
        genericRequire(component, clientRequire);
    });
    sharedComponents().forEach(function(component) {
        genericRequire(component, sharedRequire);
    });
}

// run client
core.load();
core.start();
