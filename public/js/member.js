angular.module('rocktriclub')

  .config(['$locationProvider', '$routeProvider',
    function ($locationProvider, $routeProvider) {
      $locationProvider.html5Mode(false);

      $routeProvider.
        when('/', {
          templateUrl: '/partials/member.html',
          controller: 'MemberCtrl'
        }).
        when('/profile', {
          templateUrl: '/partials/profile.html',
          controller: 'ProfileCtrl'
        })
    }])



  .controller('MemberCtrl', ['$scope', '$firebase', 'session',
    function($scope, $firebase, session) {

      $scope.signin = function () {
        session.login();
      }

    }])

  .controller('ProfileCtrl', ['$scope', 'session', '$firebase', '$location',
    function($scope, session, $firebase, $location) {

      $scope.$watch('session.user.uid', function() {
        if (session.user && session.user.uid) {

          if (!session.user.isMember) {
            return $location.path('/');
          }

          var uid = session.user.uid;
          var paymentsRef = session.firebase.child('payments').child(uid);
          $scope.payments = $firebase(paymentsRef);

          $scope.email = session.user.email;
          $scope.displayName = session.user.displayName;
          $scope.phone = session.user.phone;
        }
      });

      $scope.stripeTimestampToDate = function (ts) {
        return new Date(ts*1000);
      }

      $scope.saveProfile = function () {
        session.user.$child('displayName').$set($scope.displayName);
        session.user.$child('email').$set($scope.email);
        session.user.$child('phone').$set($scope.phone);
      }

    }])

  // Join Controller
  .controller('JoinCtrl', ['$scope', '$firebase', 'session', '$http',
    function($scope, $firebase, session, $http) {

      $scope.beforeprocessJoin = function () {
        $scope.isBusy = true;
        setError();
      }

      $scope.processJoin = function(status, response) {

        if (response.error) {
          setError(response.error.message);
          $scope.isBusy = false;
          return;
        }

        var data = {
          uid: session.user.uid,
          cardToken: response.id,
          type: $scope.type
        }

        $http.post('/api/join', data).
          success(function(data, status) {
            console.log('Success!');
            //$scope.isBusy = false;
            successfullyJoined();
        }).
          error(function(data, status) {
            console.log('Error', data, status);
            $scope.isBusy = false;
            setError('There was a problem processing your payment!');
          });
      };

      function setError (msg) {
        $scope.errorMsg = msg;
      }

      function successfullyJoined() {

      }

      // default to individual membership
      $scope.type = "Individual";
      setError();
      $scope.isBusy = false;

    }])

  .directive('join', function () {
    return {
      restrict: 'E',
      templateUrl: 'partials/join.html',
      controller: 'JoinCtrl'
    }
  })


