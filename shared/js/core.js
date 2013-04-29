var EventEmitter = require('events').EventEmitter;

exports.create = function(){

    var components = {};

    var emitter = new EventEmitter();

    /**
     * Returns all loaded component keys.
     */
    function getComponents() {
        return Object.keys(components);
    }

    /**
     * Returns the requisted component.
     * @param  {[type]} component [description]
     */
    function getComponent(component) {
        return components[component];
    }

    /**
     * Starts the given component, or all componenets if none are given.
     * @param  {[type]} component [description]
     */
    function start(component) {
        if (component === undefined) {
            Object.keys(components).forEach(function(component) {
                start(component);
            });
        }
        else {
            console.info("Starting \'%s\'", component);
            if (!components[component].isRunning()) {
                try {
                    components[component].start();
                }
                catch(e) {
                    console.error("Failed to start \'%s\'\n%s", component, e);
                }
            }
            else {
                console.info("Already running");
            }
        }
    }

    /**
     * Stops the given comonent, or all if none are given.
     * @param  {[type]} component [description]
     */
    function stop(component) {
        if (component === undefined) {
            Object.keys(components).forEach(function(component) {
                stop(component);
            });
        }
        else {
            console.info("Stopping \'%s\'", component);
            if (components[component].isRunning()) {
                try {
                    components[component].stop();
                }
                catch(e) {
                    console.error("Failed to stop \'%s\'\n%s", component, e);
                }
            }
            else {
                console.info("Not running");
            }
        }
    }

    /**
     * Restarts the given component, or all if none are given.
     * @param  {[type]} component [description]
     */
    function restart(component) {
        stop(component);
        start(component);
    }

    /**
     * Adds an instance of the given component to the core if there is not one
     * already.
     * @param {[type]} name      [description]
     * @param {[type]} component [description]
     */
    function add(name, component) {
        if (!components[name]) {
            components[name] = component.create(emitter);
            console.info("Added \'%s\'", name);
        }
        else {
            console.error("Already added \'%S\'", name);
        }
    }

    /**
     * Stops and removes the given component.
     * @param  {[type]} component [description]
     */
    function remove(component) {
        if (component === undefined) {
            Object.keys(components).forEach(function(component) {
                remove(component);
            });
        }
        else {
            if (components[component]) {
                stop(component);
                console.info("Removing \'%s\'", component);
                delete components[component];
            }
            else {
                console.error("Cannot remove non-loaded component \'%s\'",
                    component);
            }
        }
    }

    // public functions
    var core = {
        start: start,
        stop: stop,
        restart: restart,
        getComponents: getComponents,
        getComponent: getComponent,
        component: getComponent,
        components: getComponents,
        add: add,
        remove: remove
    }

    return core;
};

