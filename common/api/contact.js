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
 function fetchContact(callback) {
     prismic.Api('https://mickalene-thomas.prismic.io/api', function(err, Api) {
         Api.form('everything')
             .ref(Api.master())
             .query(prismic.Predicates.at("document.type", "contact")).pageSize(200).submit(function(err, response) {
                 if (err) {
                     console.log(err);
                     done();
                 }

                 var data = response.results[0].data;

                 console.log(data, 'contact data')

                 var obj = {};
                 obj.studio = {};
                 obj.studio.name = data['contact.name'] ?  data['contact.name'].value : null;
                 obj.studio.address = data['contact.address'] ? data['contact.address'].value : null;
                 obj.studio.address2 = data['contact.address2'] ? data['contact.address2'].value : null;
                 obj.studio.city = data['contact.city'] ? data['contact.city'].value : null;
                 obj.studio.country = data['contact.country'] ? data['contact.country'].value : null;
                 obj.studio.email = data['contact.email'] ? data['contact.email'].value : null;
                 obj.studio.name = data['contact.name'] ? data['contact.name'].value : null;
                 obj.studio.state = data['contact.state'] ? data['contact.state'].value : null;
                 obj.studio.zipcode = data['contact.zipcode'] ? data['contact.zipcode'].value : null;
                 obj.galleries = [];
                 obj.studio.twitter = data['contact.twitter'] ? data['contact.twitter'].value : null;
                 obj.studio.fb = data['contact.facebook'] ? data['contact.facebook'].value : null;

                 data['contact.galleries'].value.forEach(function(gallery) {
                    var galObj = {};
                    galObj.name = gallery.name ? gallery.name.value : null;
                    galObj.address = gallery.address ? gallery.address.value : null;
                    galObj.address2 = gallery.address2 ? gallery.address2.value : null;
                    galObj.city = gallery.city ? gallery.city.value : null;
                    galObj.country = gallery.country ? gallery.country.value : null;
                    galObj.email = gallery.email ? gallery.email.value : null;
                    galObj.fax = gallery.fax ? gallery.fax.value : null;
                    galObj.phone = gallery.phone ? gallery.phone.value : null;
                    galObj.state = gallery.state ? gallery.state.value : null;
                    galObj.website = gallery.website ? gallery.website.value : null;
                    galObj.zipcode = gallery.zipcode ? gallery.zipcode.value : null;
                    obj.galleries.push(galObj);

                 })

                callback(null, obj)
             })
     });
 }






