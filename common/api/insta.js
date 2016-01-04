var request = require('superagent');

export
function fetchInsta(callback) {
request
   .get('/api/instagram')
   .type('json')
   .end(function(err, res){
    console.log(res, "instagram api")
        callback(null, res)
   });
}