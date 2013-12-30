var config = require('../lib/config');

/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Rock Tri Club', config: config });
};

exports.member = function(req, res){
  res.render('member', { title: 'Rock Tri Club Membership', config: config });
};

exports.workouts = function(req, res){
  res.render('workouts', { title: 'Rock Tri Club Workouts', config: config });
};

exports.results = function(req, res){
  res.render('results', { title: 'Rock Tri Club Results', config: config });
};

exports.stripe = require('./stripe');