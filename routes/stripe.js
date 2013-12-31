
var config = require('../lib/config');
var emailNewMember = require('../lib/emailNewMember');
var stripe = require('stripe')(config.stripe_api_key);
var Firebase = require('firebase');
var rootRef = new Firebase(config.firebase_root_url);

// auth to firebase as admin
rootRef.auth(config.firebase_secret);

exports.join = function(req, res, next){

  var cardToken = req.body.cardToken;
  var uid = req.body.uid;
  var type = req.body.type;
  //var firebaseSessionKey = req.cookies.firebaseSessionKey;

  var amount = (type === 'Individual') ? 30
             : (type === 'Family') ? 60
             : (type === '6202 Individual') ? 50
             : (type === '6202 Family') ? 90
             : -1;

  if (amount < 0) {
    return next(new Error('Invalid membership type ' + type));
  }

  if (!cardToken) {
    return next(new Error('missing cardToken'));
  }

  if (!uid) {
    return next(new Error('missing uid'));
  }

  var userRef = rootRef.child('people').child(uid);
  var userPaymentsRef = rootRef.child('payments').child(uid);

  userRef.once('value', function (userSnapshot) {
    if (userSnapshot.value === null) {
      return next(new Error('user with uid ' + uid + ' unknown'));
    }

    var user = userSnapshot.val();

    // the user exists, try to process the payment then
    stripe.charges.create({
        amount: amount*100,
        currency: 'usd',
        card: cardToken
    }).then(function(charge) {
      // Charge succeeded
      console.log(charge);

      charge.description = type + ' Membership';

      userPaymentsRef.child(charge.id).set(charge);
      userRef.child('isMember').set(true);

      // if the user has an email address set, send them a confirmation email
      if (user.email) {
        var card = charge.card.type + ' *****' + charge.card.last4;
        emailNewMember(user.email, user.displayName, charge.description, amount, card)
      }

      return res.send(charge);
    }, function(err) {
      var msg = 'Problem processing payment for ' + uid;
      console.error(msg, err);
      return next(new Error(msg, err));
    });

  });
};
