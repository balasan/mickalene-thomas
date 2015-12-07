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

 export function fetchItem(id, callback) {
    // console.log(id)
   prismic.Api('https://mickalene-thomas.prismic.io/api', function(err, Api) {
     Api.form('everything')
             .ref(Api.master())
             .query(prismic.Predicates.at("document.id", id)).submit(function(err, response) {
                 if (err) {
                     console.log(err);
                     done();
                 }
                 var simple = [];
                 response.results.forEach(function(item) {
                    var obj = {}
                    obj.id = item.id;
                    obj.image = item.data["image.image"].value.main.url;
                    obj.title = item.data["image.title"].value[0].text;
                    obj.date = item.data["image.date"].value;
                    simple.push(obj)
                 });
                 callback(null, simple)
             })
     });
 }

 export function fetchWork(callback) {
     prismic.Api('https://mickalene-thomas.prismic.io/api', function(err, Api) {
         Api.form('everything')
             .ref(Api.master())
             .query(prismic.Predicates.at("document.type", "image")).submit(function(err, response) {
                 if (err) {
                     console.log(err);
                     done();
                 }
                 var simple = [];
                 response.results.forEach(function(item) {
                    var obj = {}
                    obj.id = item.id;
                    obj.image = item.data["image.image"].value.main.url;
                    obj.title = item.data["image.title"].value[0].text;
                    obj.date = item.data["image.date"].value;
                    simple.push(obj)
                 });
                 callback(null, simple)
             })
     });
 }
