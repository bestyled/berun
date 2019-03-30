const getClientEnvironment = require('./env');
const paths = require('./paths');

module.exports.defaultOptions = {
    paths
}

Object.defineProperty(module.exports.defaultOptions, "env", {
    get() { return getClientEnvironment(paths.publicUrl) },
    set(value) {  },
    enumerable: true,
    configurable: true
});