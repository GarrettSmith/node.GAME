/**
 * Clears the cache of required files so that they can be reopened.
 */
exports.clearRequireCache = function() {
    // clear the require cache so changes in files are reflected
    Object.keys(require.cache).forEach(function(key) {
        delete require.cache[key];
    });
}