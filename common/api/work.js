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
 function fetchItem(id, callback) {
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
                     obj.tags = item.tags;
                     obj.image = {};
                     obj.image.main = item.data["work.image"].value.main.url;

                     if (item.data["work.image"].value.main.dimensions.width < 1000) {
                         obj.image.small = item.data["work.image"].value.main.url;
                     } else {
                         obj.image.small = item.data["work.image"].value.views.small.url;
                     }

                     if (item.data["work.image"].value.main.dimensions.width < 1920) {
                        obj.image.medium = item.data["work.image"].value.main.url;
                     } else {
                        obj.image.medium = item.data["work.image"].value.views.medium.url;
                     }

                     if (item.data["work.image"].value.main.dimensions.width < 3840) {
                        obj.image.large = item.data["work.image"].value.main.url;
                     } else {
                        obj.image.large = item.data["work.image"].value.views.large.url;
                     }

                     obj.title = item.data["work.title"].value[0].text;
                     obj.date = item.data["work.date"] ? item.data["work.date"].value : '';
                     simple.push(obj)
                 });
                 callback(null, simple)
             })
     });
 }

 export
 function fetchWork(callback) {
     prismic.Api('https://mickalene-thomas.prismic.io/api', function(err, Api) {
         Api.form('everything')
             .ref(Api.master())
             .query(prismic.Predicates.at("document.type", "work")).submit(function(err, response) {
                 if (err) {
                     console.log(err);
                     done();
                 }
                 var simple = [];
                 response.results.forEach(function(item) {
                     var obj = {}
                     obj.id = item.id;
                     obj.tags = item.tags;
                     obj.image = {};
                     obj.image.main = item.data["work.image"].value.main.url;

                     if (item.data["work.image"].value.main.dimensions.width < 1000) {
                         obj.image.small = item.data["work.image"].value.main.url;
                     } else {
                         obj.image.small = item.data["work.image"].value.views.small.url;
                     }

                     if (item.data["work.image"].value.main.dimensions.width < 1920) {
                        obj.image.medium = item.data["work.image"].value.main.url;
                     } else {
                        obj.image.medium = item.data["work.image"].value.views.medium.url;
                     }

                     if (item.data["work.image"].value.main.dimensions.width < 3840) {
                        obj.image.large = item.data["work.image"].value.main.url;
                     } else {
                        obj.image.large = item.data["work.image"].value.views.large.url;
                     }

                     obj.title = item.data["work.title"].value[0].text;
                     obj.date = item.data["work.date"] ? item.data["work.date"].value : '';
                     simple.push(obj)
                 });
                 callback(null, simple)
             })
     });
 }