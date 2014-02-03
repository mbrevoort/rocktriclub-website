var request = require('request')
  , http = require('http')
  ;

var relativeRe = new RegExp('href="/athletes/', 'g');
var protocolRe = new RegExp('http://', 'g');

exports.latest = function(req, response, next) {
  request({
    uri: 'http://www.strava.com/clubs/rocktriclub/latest-rides/cc320539735d33d930ac41e763b73b7ac6d65925?show_rides=true'
  }, function (error, res, body) {
    if (res.headers['content-type']){
      response.setHeader('content-type', res.headers['content-type']);
    }
    body = body.replace(relativeRe, 'href="http://www.strava.com/athletes/');
    body = body.replace(protocolRe, '//');
    response.send(body);
  })
  .on('error', function (error) {
    console.log('strava latest error:', error);
    response.send(error);
  });
}

exports.summary = function(req, response, next) {
  request({
    uri: 'http://www.strava.com/clubs/rocktriclub/latest-rides/cc320539735d33d930ac41e763b73b7ac6d65925?show_rides=false'
  }, function (error, res, body) {
    if (res.headers['content-type']){
      response.setHeader('content-type', res.headers['content-type']);
    }
    body = body.replace(protocolRe, '//');
    response.send(body);
  })
  .on('error', function (error) {
    console.log('strava latest error:', error);
    response.send(error);
  });
}
