angular.module('stripe', []).directive('stripeForm', ['$window',
function($window) {

  var directive = { restrict: 'A' };
  directive.link = function(scope, element, attributes) {
    var form = angular.element(element);
    form.bind('submit', function() {
      //var button = form.find('button');

      // fire a before handler
      if (scope['before' + attributes.stripeForm]) {
         scope['before' + attributes.stripeForm].apply(scope);
      }

      $window.Stripe.createToken(form[0], function() {
        var args = arguments;
        scope.$apply(function() {
          scope[attributes.stripeForm].apply(scope, args);
        });
        //button.prop('disabled', false);
      });
    });
  };
  return directive;

}]);
