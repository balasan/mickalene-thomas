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
    var allNews = [];

    function callbackFunc() {
      callback(null, allNews);
    }

    prismic.Api('https://mickalene-thomas.prismic.io/api', function(err, Api) {
      Api.form('everything').ref(Api.master())
      .query(prismic.Predicates.at("document.type", "news"))
      .orderings('[news.date desc]')
      .pageSize(20)
      .submit(function(err, response) {
        if (err) {
          console.log(err);
          callback();
        }
        var totalPages = response.total_pages;
        pageLoop(totalPages)
       });
    });

     function pageLoop(totalPages) {
         var currentPage = 0;

         for (currentPage = 1; currentPage <= totalPages; currentPage++) {
             pageQuery(currentPage, totalPages);
         }
     }

     function pageQuery(currentPage, totalPages) {
         prismic.Api('https://mickalene-thomas.prismic.io/api', function(err, Api) {
             Api.form('everything')
                 .ref(Api.master())
                 .query(prismic.Predicates.at("document.type", "news"))
                 .orderings('[my.news.date desc]')
                 .page(currentPage)
                 .pageSize(20)
                 .submit(function(err, response) {
                  if (err) {
                    console.log(err);
                    callback();
                  }
                  response.results.forEach(function(item, i) {
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
                     if (allNews.length > 0) {
                       var allIds = [];
                       allNews.forEach(function(newsItem, v) {
                         allIds.push(newsItem.id);
                         if (v == allNews.length - 1) {
                            if (allIds.indexOf(obj.id) < 0) allNews.push(obj);
                            if (currentPage == totalPages && i == response.results.length - 1) callbackFunc();
                         }
                       });
                     } else {
                       allNews.push(obj);
                       if (currentPage == totalPages && i == response.results.length - 1) callbackFunc();
                     }
                 });
             })
         });
     }
 }
