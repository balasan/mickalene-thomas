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
 function fetchAbout(callback) {
     prismic.Api('https://mickalene-thomas.prismic.io/api', function(err, Api) {
         Api.form('everything')
             .ref(Api.master())
             .query(prismic.Predicates.at("document.type", "about")).pageSize(200).submit(function(err, response) {
                 if (err) {
                     console.log(err);
                     done();
                 }

                 var data = response.results[0].data;
                 // console.log(data, 'about data')

                 var obj = {};
                 obj.header = data['about.header'].value[0].text;
                 obj.body = [];
                 obj.image = data['about.image'] ? data['about.image'].value.main.url : null;
                data['about.body'].value.forEach(function(text) {
                    obj.body.push(text.text);
                })
                callback(null, obj)
             })
     });
 }






