const BeRun = require('./berun');

let _current;

module.exports = (middleware = null, options = {}) => {

  const berun = new BeRun(options);
  _current = berun;
  
  if (middleware)
  berun.use(middleware);
  else
  berun.use(berun.options.paths.config);

  return berun

};

module.exports.current = () => _current|| module.exports();