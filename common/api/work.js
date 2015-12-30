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
                 console.log(response, 'work response')
                 response.results.forEach(function(item) {
                     var obj = {}
                     obj.id = item.id;
                     obj.tags = item.tags;
                     obj.title = item.data["work.title"].value[0].text;
                     obj.date = item.data["work.date"] ? item.data["work.date"].value : '';
                     obj.medium = item.data["work.medium"] ? item.data["work.medium"].value[0].text : null;

                     obj.image = {};

                     obj.image.main = {};
                     obj.image.main.dimensions = {}
                     obj.image.small = {};
                     obj.image.small.dimensions = {};
                     obj.image.medium = {};
                     obj.image.medium.dimensions = {};
                     obj.image.large = {};
                     obj.image.large.dimensions = {};

                     obj.image.main.url = item.data["work.image"].value.main.url;
                     obj.image.main.dimensions.height = item.data["work.image"].value.main.dimensions.height;
                     obj.image.main.dimensions.width = item.data["work.image"].value.main.dimensions.width;


                     if (item.data["work.image"].value.main.dimensions.width < 1000) {
                         obj.image.small.url = item.data["work.image"].value.main.url;
                        obj.image.small.dimensions.height = item.data["work.image"].value.main.dimensions.height;
                        obj.image.small.dimensions.width = item.data["work.image"].value.main.dimensions.width;
                     } else {
                         obj.image.small.url = item.data["work.image"].value.views.small.url;
                        obj.image.small.dimensions.height = item.data["work.image"].value.views.small.dimensions.height;
                        obj.image.small.dimensions.width = item.data["work.image"].value.views.small.dimensions.width;
                     }

                     if (item.data["work.image"].value.main.dimensions.width < 1920) {
                        obj.image.medium.url = item.data["work.image"].value.main.url;
                        obj.image.medium.dimensions.height = item.data["work.image"].value.main.dimensions.height;
                        obj.image.medium.dimensions.width = item.data["work.image"].value.main.dimensions.width;
                     } else {
                        obj.image.medium.url = item.data["work.image"].value.views.medium.url;
                        obj.image.medium.dimensions.height = item.data["work.image"].value.views.medium.dimensions.height;
                        obj.image.medium.dimensions.width = item.data["work.image"].value.views.medium.dimensions.width;
                     }

                     if (item.data["work.image"].value.main.dimensions.width < 3840) {
                        obj.image.large.url = item.data["work.image"].value.main.url;
                        obj.image.large.dimensions.height = item.data["work.image"].value.main.dimensions.height;
                        obj.image.large.dimensions.width = item.data["work.image"].value.main.dimensions.width;
                     } else {
                         obj.image.large.url = item.data["work.image"].value.views.large.url;
                        obj.image.large.dimensions.height = item.data["work.image"].value.views.large.dimensions.height;
                        obj.image.large.dimensions.width = item.data["work.image"].value.views.large.dimensions.width;
                     }

                     simple.push(obj)
                 });
 console.log(simple, 'item')
                 callback(null, simple)
             })
     });
 }

 export
 function fetchWork(callback) {
     prismic.Api('https://mickalene-thomas.prismic.io/api', function(err, Api) {
         Api.form('everything')
             .ref(Api.master())
             .query(prismic.Predicates.at("document.type", "work")).pageSize(200).submit(function(err, response) {
                 if (err) {
                     console.log(err);
                     done();
                 }
                 var simple = [];
                 response.results.forEach(function(item) {
                     var obj = {}
                     obj.id = item.id;
                     obj.tags = item.tags;
                     obj.title = item.data["work.title"].value[0].text;
                     obj.date = item.data["work.date"] ? item.data["work.date"].value : '';
                     obj.medium = item.data["work.medium"] ? item.data["work.medium"].value[0].text : null;

                     obj.image = {};

                     obj.image.main = {};
                     obj.image.main.dimensions = {}
                     obj.image.small = {};
                     obj.image.small.dimensions = {};
                     obj.image.medium = {};
                     obj.image.medium.dimensions = {};
                     obj.image.large = {};
                     obj.image.large.dimensions = {};

                     obj.image.main.url = item.data["work.image"].value.main.url;
                     obj.image.main.dimensions.height = item.data["work.image"].value.main.dimensions.height;
                     obj.image.main.dimensions.width = item.data["work.image"].value.main.dimensions.width;


                     if (item.data["work.image"].value.main.dimensions.width < 1000) {
                         obj.image.small.url = item.data["work.image"].value.main.url;
                        obj.image.small.dimensions.height = item.data["work.image"].value.main.dimensions.height;
                        obj.image.small.dimensions.width = item.data["work.image"].value.main.dimensions.width;
                     } else {
                         obj.image.small.url = item.data["work.image"].value.views.small.url;
                        obj.image.small.dimensions.height = item.data["work.image"].value.views.small.dimensions.height;
                        obj.image.small.dimensions.width = item.data["work.image"].value.views.small.dimensions.width;
                     }

                     if (item.data["work.image"].value.main.dimensions.width < 1920) {
                        obj.image.medium.url = item.data["work.image"].value.main.url;
                        obj.image.medium.dimensions.height = item.data["work.image"].value.main.dimensions.height;
                        obj.image.medium.dimensions.width = item.data["work.image"].value.main.dimensions.width;
                     } else {
                        obj.image.medium.url = item.data["work.image"].value.views.medium.url;
                        obj.image.medium.dimensions.height = item.data["work.image"].value.views.medium.dimensions.height;
                        obj.image.medium.dimensions.width = item.data["work.image"].value.views.medium.dimensions.width;
                     }

                     if (item.data["work.image"].value.main.dimensions.width < 3840) {
                        obj.image.large.url = item.data["work.image"].value.main.url;
                        obj.image.large.dimensions.height = item.data["work.image"].value.main.dimensions.height;
                        obj.image.large.dimensions.width = item.data["work.image"].value.main.dimensions.width;
                     } else {
                         obj.image.large.url = item.data["work.image"].value.views.large.url;
                        obj.image.large.dimensions.height = item.data["work.image"].value.views.large.dimensions.height;
                        obj.image.large.dimensions.width = item.data["work.image"].value.views.large.dimensions.width;
                     }

                     simple.push(obj)
                 });

                function shuffle(array) {
                  var currentIndex = array.length, temporaryValue, randomIndex;

                  while (0 !== currentIndex) {

                    randomIndex = Math.floor(Math.random() * currentIndex);
                    currentIndex -= 1;

                    temporaryValue = array[currentIndex];
                    array[currentIndex] = array[randomIndex];
                    array[randomIndex] = temporaryValue;
                  }

                  return array;
                }

                shuffle(simple)

                callback(null, simple)
             })
     });
 }

 export
 function fetchTags(callback) {
     prismic.Api('https://mickalene-thomas.prismic.io/api', function(err, Api) {
         Api.form('everything')
             .ref(Api.master())
             .query(prismic.Predicates.at("document.type", "work")).pageSize(200).submit(function(err, response) {
                 if (err) {
                     console.log(err);
                     done();
                 }
                 var tags = [];
                 response.results.forEach(function(item) {
                    item.tags.forEach(function(tag){
                        tags.push(tag)
                    })
                 });

                  var uniqueTags = [];

                    tags.forEach(function(tag) {
                      if(uniqueTags.indexOf(tag) < 0) {
                        uniqueTags.push(tag)
                      }
                    })

                callback(null, uniqueTags)
             })
     });
 }















