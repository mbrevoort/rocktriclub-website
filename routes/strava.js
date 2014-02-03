var request = require('request')
  , http = require('http')
  ;

var relativeRe = new RegExp('href="/athletes/', 'g');

exports.latest = function(req, response, next) {
  request({
    uri: 'http://www.strava.com/clubs/rocktriclub/latest-rides/cc320539735d33d930ac41e763b73b7ac6d65925?show_rides=true'
  }, function (error, res, body) {
    if (res.headers['content-type']){
      response.setHeader('content-type', res.headers['content-type']);
    }
    var re = new RegExp('href="/athletes/', 'g');
    body = body.replace(relativeRe, 'href="http://www.strava.com/athletes/');
    response.send(body);
  })
  .on('error', function (error) {
    console.log('strava latest error:', error);
    response.send(error);
  });
}

exports.summary = function(req, response, next) {
  http.get({
    host: 'www.strava.com',
    path: '/clubs/rocktriclub/latest-rides/cc320539735d33d930ac41e763b73b7ac6d65925?show_rides=false'
  }, function(res) {
    res.pipe(response);
  }).on('error', function (error) {
    console.log('strava latest error:', error);
    response.send(error);
  });
}
