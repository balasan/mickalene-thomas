var request = require('superagent');

export
function fetchInsta(url, callback) {
  var additional = 'blank';
  if (url) additional = url;
request
   .get('/api/instagram')
   .query({ url: additional })
   .accept('application/json')
   .end(function(err, res){
      //console.log(res.body, "instagram api")
      callback(null, res)
   });
}

