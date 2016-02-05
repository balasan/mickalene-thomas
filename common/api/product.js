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
                 console.log(response, 'product-var response')
                 var simple = [];
                 response.results.forEach(function(item) {
                     var obj = {}
                     obj.id = item.id;
                     obj.tags = item.tags;
                      obj.type = item.type;
                     obj.title = item.data["product-v.title"] ? item.data["product-v.title"].value[0].text : '';
                     obj.date = item.data["product-v.date"] ? item.data["product-v.date"].value : '';
                     obj.location = item.data["product-v.location"] ? item.data["product-v.location"].value[0].text : '';
                     obj.description = item.data["product-v.description"] ? item.data["product-v.description"].value[0].text : '';
                     obj.link = item.data["product-v.link"] ? item.data["product-v.link"].value.url : '';
                     obj.price = item.data["product-v.price"] ? item.data["product-v.price"].value : null;
                     obj.description = item.data["product-v.description"] ? item.data["product-v.description"].value[0].text : null;

                     obj.sku = item.data["product-v.sku"] ? item.data["product-v.sku"].value[0].text : null;

                     obj.image = {};
                     obj.quantity = 1;

                     obj.image.main = {};
                     obj.image.main.dimensions = {}
                     obj.image.small = {};
                     obj.image.small.dimensions = {};
                     obj.image.medium = {};
                     obj.image.medium.dimensions = {};
                     obj.image.large = {};
                     obj.image.large.dimensions = {};

                     if (item.data["product-v.image"]) {
                        obj.image.main.url = item.data["product-v.image"].value.main.url;
                     obj.image.main.dimensions.height = item.data["product-v.image"].value.main.dimensions.height;
                     obj.image.main.dimensions.width = item.data["product-v.image"].value.main.dimensions.width;


                     if (item.data["product-v.image"].value.main.dimensions.width < 1000) {
                         obj.image.small.url = item.data["product-v.image"].value.main.url;
                        obj.image.small.dimensions.height = item.data["product-v.image"].value.main.dimensions.height;
                        obj.image.small.dimensions.width = item.data["product-v.image"].value.main.dimensions.width;
                     } else {
                         obj.image.small.url = item.data["product-v.image"].value.views.small.url;
                        obj.image.small.dimensions.height = item.data["product-v.image"].value.views.small.dimensions.height;
                        obj.image.small.dimensions.width = item.data["product-v.image"].value.views.small.dimensions.width;
                     }

                     if (item.data["product-v.image"].value.main.dimensions.width < 1920) {
                        obj.image.medium.url = item.data["product-v.image"].value.main.url;
                        obj.image.medium.dimensions.height = item.data["product-v.image"].value.main.dimensions.height;
                        obj.image.medium.dimensions.width = item.data["product-v.image"].value.main.dimensions.width;
                     } else {
                        obj.image.medium.url = item.data["product-v.image"].value.views.medium.url;
                        obj.image.medium.dimensions.height = item.data["product-v.image"].value.views.medium.dimensions.height;
                        obj.image.medium.dimensions.width = item.data["product-v.image"].value.views.medium.dimensions.width;
                     }

                     if (item.data["product-v.image"].value.main.dimensions.width < 3840) {
                        obj.image.large.url = item.data["product-v.image"].value.main.url;
                        obj.image.large.dimensions.height = item.data["product-v.image"].value.main.dimensions.height;
                        obj.image.large.dimensions.width = item.data["product-v.image"].value.main.dimensions.width;
                     } else {
                         obj.image.large.url = item.data["product-v.image"].value.views.large.url;
                        obj.image.large.dimensions.height = item.data["product-v.image"].value.views.large.dimensions.height;
                        obj.image.large.dimensions.width = item.data["product-v.image"].value.views.large.dimensions.width;
                     }
                     }
                     simple.push(obj)
                 });

                // console.log(simple, 'product simple')
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
                 console.log(response.results[0], 'single product response')
                 response.results.forEach(function(item) {

                     var obj = {}
                     obj.id = item.id;
                     obj.tags = item.tags;
                     obj.title = item.data["product-v.title"].value[0].text;
                     obj.date = item.data["product-v.date"] ? item.data["product-v.date"].value : '';
                     obj.medium = item.data["product-v.medium"] ? item.data["product-v.medium"].value[0].text : null;
                     obj.price = item.data["product-v.price"] ? item.data["product-v.price"].value : null;
                     obj.description = item.data["product-v.description"] ? item.data["product-v.description"].value[0].text : null;
                     obj.sku = [];
                     obj.images = [];

                     if (item.data["product-v.variation"]) {

                        item.data["product-v.variation"].value.forEach(function(vari) {
                            obj.sku.push(vari.variationSku.value);
                        });

                     } else {

                        var singleSku = item.data["product-v.sku"] ? item.data["product-v.sku"].value : null;
                        obj.sku.push(singleSku);
                        var image = item.data["product-v.image"] ? item.data["product-v.image"].value.main.url : null;
                     }

                     obj.image = {};
                     obj.quantity = 1;

                     obj.image.main = {};
                     obj.image.main.dimensions = {}
                     obj.image.small = {};
                     obj.image.small.dimensions = {};
                     obj.image.medium = {};
                     obj.image.medium.dimensions = {};
                     obj.image.large = {};
                     obj.image.large.dimensions = {};

                if (item.data["product-v.image"]) {
                     obj.image.main.url = item.data["product-v.image"].value.main.url;
                     obj.image.main.dimensions.height = item.data["product-v.image"].value.main.dimensions.height;
                     obj.image.main.dimensions.width = item.data["product-v.image"].value.main.dimensions.width;


                     if (item.data["product-v.image"].value.main.dimensions.width < 1000) {
                         obj.image.small.url = item.data["product-v.image"].value.main.url;
                        obj.image.small.dimensions.height = item.data["product-v.image"].value.main.dimensions.height;
                        obj.image.small.dimensions.width = item.data["product-v.image"].value.main.dimensions.width;
                     } else {
                         obj.image.small.url = item.data["product-v.image"].value.views.small.url;
                        obj.image.small.dimensions.height = item.data["product-v.image"].value.views.small.dimensions.height;
                        obj.image.small.dimensions.width = item.data["product-v.image"].value.views.small.dimensions.width;
                     }

                     if (item.data["product-v.image"].value.main.dimensions.width < 1920) {
                        obj.image.medium.url = item.data["product-v.image"].value.main.url;
                        obj.image.medium.dimensions.height = item.data["product-v.image"].value.main.dimensions.height;
                        obj.image.medium.dimensions.width = item.data["product-v.image"].value.main.dimensions.width;
                     } else {
                        obj.image.medium.url = item.data["product-v.image"].value.views.medium.url;
                        obj.image.medium.dimensions.height = item.data["product-v.image"].value.views.medium.dimensions.height;
                        obj.image.medium.dimensions.width = item.data["product-v.image"].value.views.medium.dimensions.width;
                     }

                     if (item.data["product-v.image"].value.main.dimensions.width < 3840) {
                        obj.image.large.url = item.data["product-v.image"].value.main.url;
                        obj.image.large.dimensions.height = item.data["product-v.image"].value.main.dimensions.height;
                        obj.image.large.dimensions.width = item.data["product-v.image"].value.main.dimensions.width;
                     } else {
                         obj.image.large.url = item.data["product-v.image"].value.views.large.url;
                        obj.image.large.dimensions.height = item.data["product-v.image"].value.views.large.dimensions.height;
                        obj.image.large.dimensions.width = item.data["product-v.image"].value.views.large.dimensions.width;
                     }
                }
                     simple=obj
                 });
                 callback(null, simple)
             })
     });
 }






