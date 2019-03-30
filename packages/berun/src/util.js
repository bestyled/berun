const path = require('path');

module.exports.normalizePath = (base, url) =>
  (path.isAbsolute(url) ? url : path.join(base, url));

module.exports.requireFromRoot = (moduleId, root) => {

  const paths = [
    path.join(root, moduleId),
    path.join(root, 'node_modules', moduleId),
    moduleId
  ];

  const result = paths.find(p => {
    try {
      require.resolve(p);
      return true;
    } catch (err) {
      return p === paths[paths.length - 1];
    }
  });

  // eslint-disable-next-line global-require, import/no-dynamic-require
  return require(result);
};

module.exports.isPlainObject = function (x) {
	var prototype;
	return Object.prototype.toString.call(x) === '[object Object]' && (prototype = Object.getPrototypeOf(x), prototype === null || prototype === Object.getPrototypeOf({}));
};
