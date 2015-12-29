/* eslint-disable no-console, no-use-before-define */


import path from 'path'
import Express from 'express'
import qs from 'qs'
import morgan from 'morgan'
import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import webpackConfig from '../webpack.config'

import handleRender from './render';
var router = Express.Router();



const app = new Express()

require('dotenv').config({silent: true});

//-------------Dev server watch and hot reload---------------
var isDevelopment = (process.env.NODE_ENV !== 'production');
if (isDevelopment) {
  // Use this middleware to set up hot module reloading via webpack.
  const compiler = webpack(webpackConfig)
  app.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath,
  }))
  app.use(webpackHotMiddleware(compiler))
}
app.use(morgan('dev'));

// This is fired every time the server side receives a request
// app.get('/', handleRender)
// app.use(handleRender)
// app.route('/*').get(handleRender)

//public folder
app.use(Express.static(__dirname + '/../public'));

var index = router.get('/*', handleRender)
app.use('/', index);


// app.set('appPath', Express.static(__dirname + '/public'));

var port = process.env.PORT || 3000




app.listen(port, (error) => {
  if (error) {
    console.error(error)
  } else {
    console.info(`==> 🌎  Listening on port ${port}. Open up http://localhost:${port}/ in your browser.`)
  }
})
