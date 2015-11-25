var path = require('path')
var webpack = require('webpack')

var precss = require('precss');
var easings = require('postcss-easings');
var postcss = require('postcss-loader');
var postcss = require('autoprefixer');


module.exports = {
  devtool: 'inline-source-map',
  entry: [
    'webpack-hot-middleware/client',
    './client/index.js'
  ],
  output: {
    path: path.join(__dirname, '/public'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  module: {
    postcss: function() {
      return [easings, autoprefixer, precss];
    },
    loaders: [
      {
        test: /\.css$|\.scss$/,
        loader: 'style-loader!css-loader!postcss-loader'
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
          env: {
            development: {
              plugins: [
                'react-transform'
              ],
              extra: {
                'react-transform': {
                  transforms: [
                    {
                      transform:  'react-transform-hmr',
                      imports: [ 'react' ],
                      locals:  [ 'module' ]
                    }
                  ]
                }
              }
            }
          }
        }
      }
    ]
  }
}

