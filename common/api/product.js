 var prismic = require('express-prismic').Prismic;
 var configuration = {

     apiEndpoint: 'https://mickalene-thomas.prismic.io/api',

     // -- Access token if the Master is not open
     // accessToken: 'xxxxxx',

     // OAuth
     // clientId: 'xxxxxx',
     // clientSecret: 'xxxxxx',

     // -- Links resolution rules
     // This function will be used to generate links to Prismic.io documents
     // As your project grows, you should update this function according to your routes
     linkResolver: function(doc, ctx) {
         return '/';
     }
 };

 prismic.init(configuration);

 export
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

 export
 function fetchProduct(id, callback) {
     prismic.Api('https://mickalene-thomas.prismic.io/api', function(err, Api) {

         Api.form('everything')
             .ref(Api.master())
             .query(prismic.Predicates.at("document.id", id)).submit(function(err, response) {
                 if (err) {
                     console.log(err);
                     callback();
                 }
                 var simple;
                 response.results.forEach(function(item) {
                    var obj = {}
                    obj.id = item.id;
                    obj.tags = item.tags;
                    obj.externalURL = item.data["product-v.externalURL"] ? item.data["product-v.externalURL"].value: null;
                    obj.available = true;

                    if (item.data["product-v.available"]) if (item.data["product-v.available"].value == 'No')  obj.available = false;

                    obj.title = item.data["product-v.title"].value[0].text;
                    obj.date = item.data["product-v.date"] ? item.data["product-v.date"].value : '';
                    obj.medium = item.data["product-v.medium"] ? item.data["product-v.medium"].value[0].text : null;
                    obj.price = item.data["product-v.price"] ? item.data["product-v.price"].value : null;
                    obj.description = item.data["product-v.description"] ? item.data["product-v.description"].value[0].text : null;
                    obj.vars = [];
                    obj.sizes = [];
                    obj.availSizes = [];
                    obj.sizeChart = null;
                    obj.images = [];
                     obj.quantity = 1;

                     if (item.data["product-v.sizes"]) {
                        if (item.data["product-v.sizes"].value[0]) {
                            var sizes = item.data["product-v.sizes"].value[0].sizes ? item.data["product-v.sizes"].value[0].sizes.value : null;
                            obj.sizes = sizes.split(", ");
                            var availSizes = item.data["product-v.sizes"].value[0].sizesAvailable ? item.data["product-v.sizes"].value[0].sizesAvailable.value : null;
                            obj.availSizes = availSizes.split(", ");
                            obj.sizeChart = item.data["product-v.sizes"].value[0].sizeChart ? item.data["product-v.sizes"].value[0].sizeChart.value.main.url : null;
                        }
                     }


                    if (item.data["product-v.variation"]) {
                        var mainVar = {};
                        if (item.data["product-v.variation"].value.length > 0) obj.vars.push(mainVar);
                        item.data["product-v.variation"].value.forEach(function(vari) {
                            var varObj = {};
                            varObj.available = null;
                            if (vari.available) vari.available.value == 'Available' ? varObj.available = true : varObj.available = false;
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
                simple = obj
            });
            callback(null, simple)
        })
    });
}
