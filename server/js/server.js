#!/usr/bin/env node

// read arguments
var argv = require('optimist')
    .default('config', '../../shared/js/config')
    .alias('c', 'config')
    .argv;

// setup global variables
GLOBAL.console = require('winston');
GLOBAL.CONFIG_FILE = argv.config;

var util = require('./util');

// local variables
var core = require('../../shared/js/core').create();
var config;
var repl;

/**
 * Loads the REPL if it hasn't been already.
 */
function loadRepl() {
    if(!repl) repl = require(config.server.repl);
}

/**
 * Loads the config file.
 */
function loadConfig() {
    config = require('../../shared/js/config');
}

/**
 * Components func for core.load
 * @return {[type]} [description]
 */
function components() {
    return config.server.components;
}

/**
 * Loads the given component, or all components defined in the settings file if
 * none is given.
 * @param  {[type]} component [description]
 */
core.load = function(component) {
    if (component === undefined) {
        components().forEach(function(component) {
            core.load(component);
        });
    }
    else {
        try {
            core.add(component, require('../../' + component));
            console.info("Loaded \'%s\'", component);
        }
        catch(e) {
            console.error("Failed loading \'%s\'\n%s", component, e);
        }
    }
}

/**
 * Removes and loads the given component, or removes all components and loads
 * all components defined in the config file if none are given.
 * @param  {[type]} component [description]
 */
core.reload = function(component) {
    util.clearRequireCache();
    loadConfig();
    if (config.server.enable_repl) loadRepl();

    core.remove(component);
    core.load(component);
}

/**
 * Convenience method which reloads all components and starts them.
 */
core.refresh = function() {
    core.reload();
    core.start();
}

// export REPL commands
exports.core = core;

// setup closing
process.on('exit', function(){
    console.info("Exiting");
    core.stop();
});

// run server
loadConfig();
core.load();
core.start();
if (config.server.enable_repl) loadRepl();
