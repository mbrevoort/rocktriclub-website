var http = require('http')
  ;

exports.latest = function(request, response, next) {
  http.get({
    host: 'www.strava.com',
    path: '/clubs/rocktriclub/latest-rides/cc320539735d33d930ac41e763b73b7ac6d65925?show_rides=true'
  }, function(res) {
    res.pipe(response);
  }).on('error', function (error) {
    console.log('strava latest error:', error);
    response.send(error);
  });
}

exports.summary = function(request, response, next) {
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
