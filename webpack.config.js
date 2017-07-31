const ENV = 'prod'// 'prod';
const configMap = ['dev', 'prod'];
module.exports = configMap.indexOf(ENV) > -1 
  ? require("./webpack/webpack.config." + ENV)() 
  : require("./webpack/webpack.config.dev")();


