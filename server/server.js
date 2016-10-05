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

var jsonParser = bodyParser.json();

app.post('/createOrder', jsonParser,function(req, res) {
    var stripeToken = req.body.token;
    var email = req.body.email;
    var total = 0;
    var items = [];
    var formattedItems = [];

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
        var itemObj = {};
        var varId = null;

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
                varId = titleSimple+styleSimple+sizeSimple;
            } else if (item.variation.description) {
                 description = item.title+' style: '+style;
                 varId = titleSimple+styleSimple;
            } else if (item.variation.size) {
                 description = item.title+' size: '+size;
                 varId = titleSimple+sizeSimple;
            }

            itemObj.name = titleSimple;
            if (size) itemObj.size = size;
            if (style) itemObj.variation = style;
            itemObj.description = description;
            itemObj.price = item.price;
            formattedItems.push(itemObj);

        } else {
            itemObj.description = item.title;
            itemObj.name = titleSimple;
            itemObj.price = item.price;
            formattedItems.push(itemObj);
        }
    });

    stripe.products.list(
      { limit: 100 },
      function(err, products) {
        if (err) {
            console.log(err, 'error');
        } else {
            addIds(products.data);
        }
      }
    );

    function addIds(products) {
        formattedItems.forEach(function(item, i) {
            products.forEach(function(product, x) {
                if (product.name == item.name) {
                    formattedItems[i].stripeId = product.id;
                }
            })
        });
        stripe.skus.list(
          { limit: 100 },
          function(err, skus) {
            if (err) {
                console.log(err, 'error');
            } else {
                checkSkus(skus.data);
            }
          }
        );
    }



    function checkSkus(stripeSkus) {
        console.log('check skus');
        if (stripeSkus.length == 0) {
            formattedItems.forEach(function(item) {
                createSku(item, true);
            })
        } else {
            formattedItems.forEach(function(item, i) {
                var attributesObj = {};
                if (item.size) attributesObj.size = item.size;
                if (item.variation) attributesObj.variation = item.variation;
                var exists = false;
                var bool = (i == (formattedItems.length -1));

                stripeSkus.forEach(function(sku) {
                    if (sku.product == item.stripeId) {
                        console.log(sku, 'sku match id');
                        console.log(sku.attributes, attributesObj)
                        if (JSON.stringify(sku.attributes) == JSON.stringify(attributesObj)) {
                            console.log('sku match');
                            exists = true;
                            items.push({
                                type: 'sku',
                                parent: sku.id,
                                quantity: item.quantity
                            })
                            if (bool) ordersCreate();
                        }
                    }
                })
                if (!exists) createSku(item, bool);
            })
        }
    }

    function createSku(item, bool) {
        var attributesObj = {};
        if (item.size) attributesObj.size = item.size;
        if (item.variation) attributesObj.variation = item.variation;
        console.log('create sku')
        stripe.skus.create({
          product: item.stripeId,
          attributes: attributesObj,
          price: item.price * 100,
          currency: 'usd',
          inventory: {type: 'infinite'}
        }, function(err, sku) {
            if (err) {
                console.log(err, 'sku error');
            } else {
                console.log('pushing created sku');
                items.push({
                    type: 'sku',
                    parent: sku.id,
                    quantity: item.quantity
                })
                if (bool) ordersCreate();
            }
        });
    }

    function ordersCreate() {
        stripe.customers.create({
            email: email
        }).then(function(customer) {
            return stripe.orders.create({
                currency: 'usd',
                items: items,
                customer: customer.id,
                shipping: {
                    name: req.body.name,
                    address: {
                        line1: req.body.add1,
                        line2: req.body.add2 ? req.body.add2 : '',
                        city: req.body.city,
                        country: req.body.country,
                        state: req.body.state,
                        postal_code: req.body.zip
                    }
                },
            })
        }).then(function(order) {
            console.log(order, 'order');
            res.json(200, order); 
        }).catch(function(err) {
            res.json(500, err);
        });   
    }

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
        console.log(customer, 'customer update');
        return stripe.charges.create({
            amount: amount,
            currency: "usd",
            customer: customer.id,
            receipt_email: email
        });
    }).then(function(charge) {
        console.log(charge, 'charge');
        res.json(200, charge);
    }).catch(function(err) {
        res.json(500, err);
    });    
});


app.get('/update', jsonParser, function(req, res) {
    var prismic = require('express-prismic').Prismic;
    var configuration = {
        apiEndpoint: 'https://mickalene-thomas.prismic.io/api',
        linkResolver: function(doc, ctx) { return '/'; }
    };

    prismic.init(configuration);

    var formattedProducts = [];

    fetchProducts(function(err, products) {
        analyzeProducts(products);
    });

    function analyzeProducts(products) {
        products.forEach(function(item, i) {
            var singleItem = {};
            var description = null;
            var titleSplit = item.title.split(' ').join('_');
            var titleSimple = titleSplit.replace(/\W/g, '');
            var prodId = null;
            var sizes = false;
            var variations = false;
            var pushBool = true;

            if (item.sizes) sizes = true;
            if (item.vars.length) {
                variations = true;
                item.vars.forEach(function(itemVar, i) {
                    if (itemVar.externalURL) pushBool = false;
                })
            }

            description = item.title;
            prodId = titleSimple;

            singleItem.description = description;
            singleItem.prodId = prodId;
            singleItem.sizes = sizes;
            singleItem.variations = variations;
            if (!item.externalURL && pushBool) formattedProducts.push(singleItem);
        });


        stripe.products.list(
          { limit: 100 },
          function(err, stripeProducts) {
            if (err) {
                console.log(err, 'product list error');
                res.json(500, err);
            } else {
                checkExisiting(stripeProducts);
            }
          }
        ); 

        function checkExisiting(stripeProducts) {

            formattedProducts.forEach(function(prismicProduct, i) {
                var exists = false;
                stripeProducts.data.forEach(function(singleProduct, x) {
                    if (singleProduct.name == prismicProduct.prodId) {
                        exists = true;
                        updateItem(prismicProduct, singleProduct)
                    }
                })
                if (!exists) createItem(prismicProduct);
            })
        }

        function createItem(item) {
            var attributesArr = [];
            if (item.sizes) attributesArr.push('size');
            if (item.variations) attributesArr.push('variation')
            stripe.products.create({
              name: item.prodId,
              description: item.description,
              attributes: attributesArr
            }, function(err, product) {
                if (err) {
                    console.log(err, 'error');
                } else {
                    console.log('created product');
                }
            });
        }

        function updateItem(newItem, oldItem) {
            stripe.products.update(oldItem.id, {
              description:  newItem.description
            }, function(err, updatedProd) {
                if (err) {
                    console.log(err, 'error')
                } else {
                    console.log('successfully updated product')
                }
            })
        }

        res.send("success")
    }

    function fetchProducts(callback) {
         prismic.Api('https://mickalene-thomas.prismic.io/api', function(err, Api) {
             Api.form('everything')
                 .ref(Api.master())
                 .query(prismic.Predicates.at("document.type", "product-v")).pageSize(100).submit(function(err, response) {
                     if (err) {
                         console.log(err);
                         done();
                     }
                     var simple = [];
                     response.results.forEach(function(item) {
                         var obj = {}
                         obj.id = item.id;
                         obj.externalURL = item.data["product-v.externalURL"] ? item.data["product-v.externalURL"].value: null;
                         obj.available = true;
                         obj.vars = [];
                         obj.sizes = null;
                         if (item.data["product-v.sizes"]) {
                            if (item.data["product-v.sizes"].value.length) {
                                //console.log(item.data["product-v.sizes"].value[0].sizes.value, 'sizes');
                                obj.sizes = item.data["product-v.sizes"].value[0].sizes.value;
                            }
                         }

                         if (item.data["product-v.available"]) {
                            if (item.data["product-v.available"].value == 'No') {
                                obj.available = false;
                            }
                         }

                         obj.title = item.data["product-v.title"] ? item.data["product-v.title"].value[0].text : '';
                         obj.date = item.data["product-v.date"] ? item.data["product-v.date"].value : '';
                         obj.description = item.data["product-v.description"] ? item.data["product-v.description"].value[0].text : '';
                         obj.link = item.data["product-v.link"] ? item.data["product-v.link"].value.url : '';
                         obj.price = item.data["product-v.price"] ? item.data["product-v.price"].value : null;
                         obj.description = item.data["product-v.description"] ? item.data["product-v.description"].value[0].text : null;
                         obj.images = [];
                         obj.quantity = 1;

                        if (item.data["product-v.variation"]) {
                            var mainVar = {};
                            if (item.data["product-v.variation"].value.length > 0) obj.vars.push(mainVar);
                            item.data["product-v.variation"].value.forEach(function(vari) {
                                var varObj = {};
                                varObj.available = null;
                                if (vari.available) {
                                    vari.available.value == 'Available' ? varObj.available = true : varObj.available = false;
                                }
                                varObj.image = vari.variationImage.value.views.small.url;
                                varObj.description = vari.vartiationDescription ? vari.vartiationDescription.value : null;
                                varObj.externalURL = vari.externalURL ? vari.externalURL.value : null;
                                obj.vars.push(varObj);
                                obj.images.push(varObj);
                            });
                        }
                        if (item.data["product-v.image"]) {
                            var images = item.data["product-v.image"].value;
                            var tempArr = [];
                            images.forEach(function(image, i) {
                                if (image.image) tempArr.push(image.image.value.main.url);
                            });
                     
                            var finalArr = tempArr.concat(obj.images);
                            obj.images = finalArr;
                        }
                        simple.push(obj)
                    });
                callback(null, simple)
            })
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
