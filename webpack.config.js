const ENV = 'test'// 'react2preact';
const configMap = ['truck', 'react', 'preact', 'zcreact', 'react2preact', 'test'];
module.exports = configMap.indexOf(ENV) > -1 
  ? require("./webpack/webpack.config." + ENV)() 
  : require("./webpack/webpack.config.react")();


