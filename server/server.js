/* eslint-disable no-console, no-use-before-define */
import path from 'path'
import Express from 'express'
import qs from 'qs'
import morgan from 'morgan'
import handleRender from './render';
var router = Express.Router();
var bodyParser = require('body-parser')
var stripe = require('stripe')('sk_test_4y83aHU2CwVFqFvE8jK1xNMB');
var request = require('request');
const app = new Express()

require('dotenv').config({
    silent: true
});
console.log(process.env.NODE_ENV)

//-------------Dev server watch and hot reload---------------
var isDevelopment = (process.env.NODE_ENV !== 'production');
if (isDevelopment) {
    console.log("dev env");
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

app.get('/api/instagram', function(req, res) {
    var array = [];
    var url = null;

    if (req.query.url != 'blank') {
        url = req.query.url;
    }

    getData(url);

    function getData(supplyUrl) {

        var urlToUse = 'https://api.instagram.com/v1/users/291145514/media/recent/?access_token=291145514.1677ed0.4180185b272d45569ebc889f3f815a1b&count=20';

        if (supplyUrl) urlToUse = supplyUrl;

         request(urlToUse, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var jsonBody = JSON.parse(body);
                var next = null;
                if (jsonBody.pagination.next_url) next = jsonBody.pagination.next_url;
                res.json({data: jsonBody, 'next': next})
            }
        });
    }
});


//Stripe
app.get('/stripe', function(req, res) {
    res.send("😇 😇 😇");
});

var jsonParser = bodyParser.json();

app.post('/createOrder', jsonParser,function(req, res) {
    var stripeToken = req.body.token;
    var total = 0;
    var items = [];

    req.body.cart.forEach(function(item, i) {
        total += (item.price * item.quantity);
        var size = null;
        var style = null;
        var description = null;

        var titleSplit = item.title.split(' ').join('_');
        var titleSimple = titleSplit.replace(/\W/g, '');

        var prodId = null;
        var sizeSplit = null;
        var styleSplit = null;
        var styleSimple = null;
        var sizeSimple = null;

        if (item.variation) {
            if (item.variation.description) style = item.variation.description;
            if (item.variation.size) size = item.variation.size;
            if (size) {
              sizeSplit = size.split(' ').join('_');
              sizeSimple = sizeSplit.replace(/\W/g, '');
            }
            if (style) {
              styleSplit = style.split(' ').join('_');
              styleSimple = styleSplit.replace(/\W/g, '');
            }

            if (item.variation.description && item.variation.size) {
                description = item.title+' style: '+style+' size: '+size;
                prodId = titleSimple+styleSimple+sizeSimple;
            } else if (item.variation.description) {
                 description = item.title+' style: '+style;
                 prodId = titleSimple+styleSimple;
            } else if (item.variation.size) {
                 description = item.title+' size: '+size;
                 prodId = titleSimple+sizeSimple;
            }
        } else {
            description = item.title;
            prodId = titleSimple;
        }


        var exists = 0;

        stripe.products.list(
          { limit: 100 },
          function(err, products) {
            if (products.data.length > 0) {
                 products.data.forEach(function(productX, x) {
                    if (productX.id == 'prod_'+prodId) exists += 1;
                    if (x == products.data.length-1) buildList(description, prodId, item, i, exists);
                })
            } else {
                buildList(description, prodId, item, i, exists);
            }
          }
        );

    });

    function buildList(description, prodId, item, i, exists) {

        if (exists == 0) {
            stripe.products.create({
              name: description,
              id: 'prod_'+prodId

            }, function(err, product) {
              if (err) {
                console.log(err);
              } else {
                newSkus(product, item, i, prodId);
              }
            });
        } else {
            items.push({
                type: 'sku',
                parent: 'sku_'+prodId,
                quantity: item.quantity
            })
        }

        if (i == req.body.cart.length - 1) ordersCreate();
    }

    function newSkus(product, item, i, prodId) {
        stripe.skus.create({
              product: product.id,
              id: 'sku_'+prodId,
              // attributes: {'size': size, 'style': style},
              price: item.price * 100,
              currency: 'usd',
              inventory: {'type': 'infinite'}
            }, function(err, sku) {
                items.push({
                    type: 'sku',
                    parent: sku.id,
                    quantity: item.quantity
                })
            });
    }

    function ordersCreate() {
        console.log(items, 'items')
        stripe.orders.create({
            currency: 'usd',
            items: items,
            customer: req.body.customer,
            shipping: {
                name: req.body.name,
                address: {
                    line1: req.body.add1,
                    line2: req.body.add2 ? req.body.add2 : '',
                    city: req.body.city,
                    country: req.body.country,
                    postal_code: req.body.zip
                }
            },
        }, function(err, order) {
            if (err) console.log(err, 'order create error');
            res.json(200, order);
        });
    }
});

app.post('/createCustomer', jsonParser, function(req, res) {
    var email = req.body.email;
    stripe.customers.create({
        email: email
    }).then(function(customer) {
        res.json(200, customer);
    });
});

app.post('/charge', jsonParser, function(req, res) {
    var token = req.body.token;
    var customer = req.body.customer;
    var email = req.body.email;
    var amount = req.body.amount;


    stripe.customers.update(customer, {
      source: token,
      description: email
    }).then(function(customer) {
      return stripe.charges.create({
        amount: amount, // Amount in cents
        currency: "usd",
        customer: customer.id,
        receipt_email: email
      });
    }).then(function(charge) {
      console.log(charge, 'charge');
      res.json(200, charge);
    });


        
});

//public folder
app.use(Express.static(__dirname + '/../public'));

var index = router.get('/*', handleRender)
app.use('/', index);


var port = process.env.PORT || 3000


app.listen(port, (error) => {
    if (error) {
        console.error(error)
    } else {
        console.info(`==> 🌎  Listening on port ${port}. Open up http://localhost:${port}/ in your browser.`)
    }
})
