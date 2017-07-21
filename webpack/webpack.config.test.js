var webpack = require('webpack');
module.exports = function () {
  return {
    entry: {
      console: './js/console.js',
      localStorage: './js/localStorage.js',
      structs: './js/structs.js',
    },
    output: {
      path: './dist',
      filename: '[name].min.js',
      publicPath: '/'
    },

    plugins: [
      new webpack.optimize.UglifyJsPlugin({
        mangle: true,
        compress: {warnings: false}
      })
    ],
    resolve: {
      extensions: ['', '.js', '.jsx']
    },
    module: {
      loaders: [
        {
          test: /\.less\.module$/,
          loader: 'style!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss!less'
        }
      ]
    },
    postcss: [
      require('postcss-initial')({
        reset: 'all' // reset only inherited rules
      })
      , require('autoprefixer')({
        browsers: ['last 2 versions', 'Android >= 2.1', 'iOS > 6']
      })
    ]  
  };
};
