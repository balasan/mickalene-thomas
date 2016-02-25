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
 function fetchNews(callback) {
     prismic.Api('https://mickalene-thomas.prismic.io/api', function(err, Api) {
         Api.form('everything')
             .ref(Api.master())
             .query(prismic.Predicates.at("document.type", "news")).pageSize(100).submit(function(err, response) {
                 if (err) {
                     console.log(err);
                     done();
                 }
                //  console.log(response, 'news response')
                 var simple = [];
                 response.results.forEach(function(item) {
                     var obj = {}
                     obj.id = item.id;
                     obj.tags = item.tags;
                      obj.type = item.type;
                     obj.title = item.data["news.title"].value[0].text;
                     obj.date = item.data["news.date"] ? item.data["news.date"].value : '';
                     obj.location = item.data["news.location"] ? item.data["news.location"].value[0].text : '';
                     obj.description = item.data["news.description"] ? item.data["news.description"].value[0].text : '';
                     obj.link = item.data["news.link"] ? item.data["news.link"].value.url : '';

                     obj.image = {};

                     obj.image.main = {};
                     obj.image.main.dimensions = {}
                     obj.image.small = {};
                     obj.image.small.dimensions = {};
                     obj.image.medium = {};
                     obj.image.medium.dimensions = {};
                     obj.image.large = {};
                     obj.image.large.dimensions = {};

                     if (item.data["news.image"]) {
                        obj.image.main.url = item.data["news.image"].value.main.url;
                     obj.image.main.dimensions.height = item.data["news.image"].value.main.dimensions.height;
                     obj.image.main.dimensions.width = item.data["news.image"].value.main.dimensions.width;


                     if (item.data["news.image"].value.main.dimensions.width < 1000) {
                         obj.image.small.url = item.data["news.image"].value.main.url;
                        obj.image.small.dimensions.height = item.data["news.image"].value.main.dimensions.height;
                        obj.image.small.dimensions.width = item.data["news.image"].value.main.dimensions.width;
                     } else {
                         obj.image.small.url = item.data["news.image"].value.views.small.url;
                        obj.image.small.dimensions.height = item.data["news.image"].value.views.small.dimensions.height;
                        obj.image.small.dimensions.width = item.data["news.image"].value.views.small.dimensions.width;
                     }

                     if (item.data["news.image"].value.main.dimensions.width < 1920) {
                        obj.image.medium.url = item.data["news.image"].value.main.url;
                        obj.image.medium.dimensions.height = item.data["news.image"].value.main.dimensions.height;
                        obj.image.medium.dimensions.width = item.data["news.image"].value.main.dimensions.width;
                     } else {
                        obj.image.medium.url = item.data["news.image"].value.views.medium.url;
                        obj.image.medium.dimensions.height = item.data["news.image"].value.views.medium.dimensions.height;
                        obj.image.medium.dimensions.width = item.data["news.image"].value.views.medium.dimensions.width;
                     }

                     if (item.data["news.image"].value.main.dimensions.width < 3840) {
                        obj.image.large.url = item.data["news.image"].value.main.url;
                        obj.image.large.dimensions.height = item.data["news.image"].value.main.dimensions.height;
                        obj.image.large.dimensions.width = item.data["news.image"].value.main.dimensions.width;
                     } else {
                         obj.image.large.url = item.data["news.image"].value.views.large.url;
                        obj.image.large.dimensions.height = item.data["news.image"].value.views.large.dimensions.height;
                        obj.image.large.dimensions.width = item.data["news.image"].value.views.large.dimensions.width;
                     }
                     }
                     simple.push(obj)
                 });

                // console.log(simple, 'news simple')
                callback(null, simple)
             })
     });
 }
