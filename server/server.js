/* eslint-disable no-console, no-use-before-define */


import path from 'path'
import Express from 'express'
import qs from 'qs'
import morgan from 'morgan'
var Instagram = require('instagram-node-lib');


import handleRender from './render';
var router = Express.Router();



const app = new Express()

require('dotenv').config({silent: true});
console.log(process.env.NODE_ENV)

//-------------Dev server watch and hot reload---------------
var isDevelopment = (process.env.NODE_ENV !== 'production');
if (isDevelopment) {
  console.log("DEV ENV!?!?");
  var webpack = require('webpack');
  var webpackDevMiddleware = require('webpack-dev-middleware');
  var webpackHotMiddleware = require('webpack-hot-middleware');
  var webpackConfig = require('../webpack.config');
  // Use this middleware to set up hot module reloading via webpack.
  const compiler = webpack(webpackConfig)
  app.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath,
  }))
  app.use(webpackHotMiddleware(compiler))
}
app.use(morgan('dev'));

//Instagram
Instagram.set('client_id', '6b28f9f281864fb59b94fe20c92d5322');
Instagram.set('client_secret', '7edfe35e83ba4f9f9a4dafc353f20afa');
Instagram.set('access_token', '868216340.1677ed0.ac68e70d0bd34418a78a1cdf59030f75');

console.log(Instagram.users.recent({ user_id: 868216340 })); // Notice the distinct lack of quotes around the user_Id

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
