/* eslint-disable no-console, no-use-before-define */
import path from 'path'
import Express from 'express'
import qs from 'qs'
import morgan from 'morgan'
var Instagram = require('instagram-node-lib');
import handleRender from './render';
var router = Express.Router();
var bodyParser = require('body-parser')
var stripe = require('stripe')('sk_test_4y83aHU2CwVFqFvE8jK1xNMB');

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


//Instagram
Instagram.set('client_id', 'b7ed061ff5ca4f7288c2833dc509dc44');
Instagram.set('client_secret', 'b38cc163d4f44e80aa23cf5f513088c8');
Instagram.set('access_token', '2460658527.1677ed0.ce2225bfbd194a6f939bca44d02c3017');

app.get('/api/instagram', function(req, res) {
    Instagram.users.recent({
        user_id: 2460658527,
        complete: function(data) {
            res.json(data);
        }
    });
});

//Stripe
app.get('/stripe', function(req, res) {
    res.send("😇 😇 😇");
});

var jsonParser = bodyParser.json()

app.post('/stripe', jsonParser, function(req, res) {

    var stripeToken = req.body.stripeToken;
    var total = 0;
    var items = [];

    req.body.cart.forEach(function(item, i) {
        total += (item.price * item.quantity);
        var size = null;
        var style = null;
        var description = null;
        var titleSplit = item.title.split(' ').join('_');
        var prodId = null;
        var sizeSplit = null;
        var styleSplit = null;

        if (item.variation) {
            if (item.variation.description) style = item.variation.description;
            if (item.variation.size) size = item.variation.size;
            if (size) sizeSplit = size.split(' ').join('_');
            if (style) styleSplit = style.split(' ').join('_');

            if (item.variation.description && item.variation.size) {
                description = item.title+' style: '+style+' size: '+size;
                prodId = titleSplit+styleSplit+sizeSplit;
            } else if (item.variation.description) {
                 description = item.title+' style: '+style;
                 prodId = titleSplit+styleSplit;
            } else if (item.variation.size) {
                 description = item.title+' size: '+size;
                 prodId = titleSplit+sizeSplit;
            }
        } else {
            description = item.title;
            prodId = titleSplit;
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
              // description: item.description+' style: '+style+' size: '+size,
              // attributes: ['size', 'style']
            }, function(err, product) {
                newSkus(product, item, i, prodId);
            });
        } else {
            items.push({
                type: 'sku',
                parent: 'sku_'+prodId,
                quantity: item.quantity
            })
            if (i == req.body.cart.length - 1) chargeThem();
        }

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
                if (i == req.body.cart.length - 1) chargeThem();
            });
    }


    //working customer create and charge create
    function chargesCreate(customer) {
        stripe.charges.create({
            amount: total * 100,
            currency: "usd",
            customer: customer.id,
            receipt_email: stripeToken.email,
            description: 'Mickalene Thomas store item',
            statement_descriptor: 'Mickalene Thomas store'
        });
    }

    function ordersCreate(customer) {
        stripe.orders.create({
            currency: 'usd',
            items: items,
            customer: customer.id,
            shipping: {
                name: stripeToken.card.name,
                address: {
                    line1: stripeToken.card.address_line1,
                    city: stripeToken.card.address_city,
                    country: stripeToken.card.country,
                    postal_code: stripeToken.card.address_zip
                }
            },
            email: stripeToken.email
        }, function(err, order) {
            if (err) console.log(err, 'order create error');
        });
    }

    function chargeThem() {
        stripe.customers.create({
            source: stripeToken.id,
            description: stripeToken.card.name,
            email: stripeToken.email
        }).then(function(customer) {
            var a = chargesCreate(customer);
            var b = ordersCreate(customer);
            return a && b;
        });
    }

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