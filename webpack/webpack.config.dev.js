var baseFn = require('./webpack.config.base');
module.exports = baseFn.bind(null, {
  mangle: false,
  uglify: false,
});