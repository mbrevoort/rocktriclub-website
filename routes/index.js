var config = require('../lib/config');

/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Rock Tri Club', config: config });
};

exports.member = function(req, res){
  res.render('ngview', { title: 'Rock Tri Club Membership', config: config });
};

exports.stripe = require('./stripe');