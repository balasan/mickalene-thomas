var path = require('path')
var webpack = require('webpack')

var precss = require('precss');
var customMedia = require("postcss-custom-media");
var easings = require('postcss-easings');
var postcss = require('postcss-loader');
var autoprefixer = require('autoprefixer');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  // devtool: 'inline-source-map',
  entry: [
    // 'webpack-hot-middleware/client',
    './client/index.js'
  ],
  output: {
    path: path.join(__dirname, '/public'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  plugins: [
    // new webpack.optimize.OccurenceOrderPlugin(),
    // new webpack.HotModuleReplacementPlugin(),
    // new webpack.NoErrorsPlugin(),
    new ExtractTextPlugin("styles.css"),
    new webpack.DefinePlugin({
      "process.env":{
        BROWSER: JSON.stringify(true)
      }
    })
  ],
  postcss: function() {
    return [easings, autoprefixer, precss];
  },
  module: {
       preLoaders: [
        { test: /\.json$/, loader: 'json'},
    ],
    loaders: [
      {
        test: /\.css$|\.scss$/,
        // loader: 'style-loader!css-loader!postcss-loader'
        loader: ExtractTextPlugin.extract('style-loader','css-loader!postcss-loader')
        // loader: 'css?sourceMap!postcss!sass?sourceMap&sourceMapContents',
      },
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/,
        include: __dirname,
        query: {
          optional: [ 'runtime' ],
          stage: 2,
        }
      }
    ],
  }
}

