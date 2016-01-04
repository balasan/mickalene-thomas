/* eslint-disable no-console, no-use-before-define */


import path from 'path'
import Express from 'express'
import qs from 'qs'
import morgan from 'morgan'
var Instagram = require('instagram-node-lib');

// var request = require('superagent');


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
Instagram.set('client_id', 'b7ed061ff5ca4f7288c2833dc509dc44');
Instagram.set('client_secret', 'b38cc163d4f44e80aa23cf5f513088c8');
Instagram.set('access_token', '2460658527.1677ed0.ce2225bfbd194a6f939bca44d02c3017');

app.get('/api/instagram', function(req, res) {
  Instagram.users.recent({user_id: 2460658527, complete: function(data) {
    res.json(data);
  }});
});

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
