angular.module('rocktriclub', ['firebase', 'ngRoute', 'stripe'])

  .config(['$locationProvider', '$routeProvider',
    function ($locationProvider, $routeProvider) {
      $locationProvider.html5Mode(true);

      $routeProvider.
        when('/member', {
          templateUrl: '/partials/member.html',
          controller: 'MemberCtrl'
        }).
        when('/', {
          templateUrl: '/partials/noop.html',
          controller: 'NoopCtrl'
        })
    }])

  // Main Controller
  .controller('MainCtrl', ['$scope', '$rootScope', '$location',
    function($scope, $rootScope, $location) {

      $rootScope.hideIndex = false;

      $scope.isActive = function (viewLocation) {
        return viewLocation === $location.path();
      };
    }])

  .controller('NoopCtrl', ['$scope', '$rootScope', '$location',
    function($scope, $rootScope, $location) {
      $rootScope.hideIndex = false;
      console.log('noop')
    }])

  .controller('UserStatus', ['$scope', '$firebase', 'session', '$location',
    function($scope, $firebase, session, $location) {

      $scope.session = session;

      $scope.signin = function () {
        session.login();
      }

      $scope.signout = function () {
        session.logout();
        $location.path('/')
      }

    }])

  // Join Controller
  .controller('MemberCtrl', ['$scope', '$rootScope',
    function($scope, $rootScope) {
      $rootScope.hideIndex = true;

      $scope.signin = function () {
        session.login();
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
      $scope.type = "individual";
      setError();
      $scope.isBusy = false;

    }])

  // User Status / login directive
  .directive('userStatus', function () {
    return {
      restrict: 'A',
      templateUrl: 'partials/userStatus.html',
      controller: 'UserStatus'
    }
  })

  .directive('join', function () {
    return {
      restrict: 'E',
      templateUrl: 'partials/join.html',
      controller: 'JoinCtrl'
    }
  })

  // Session Factory
  .factory('session', ['$firebase', '$rootScope',
    function ($firebase, $rootScope) {
      var session = {
        firebase: new Firebase('https://rocktriclub.firebaseio.com/'),
        user: null,
        initialized: false,
        login: function () {
          auth.login('facebook', {
            rememberMe: true,
            scope: 'email'
          });
        },
        logout: function () {
          auth.logout();
        }
      };

      var auth = new FirebaseSimpleLogin(session.firebase, function(error, user) {
        if (error) {
          console.log(error);
          $rootScope.$apply(function () {
            session.user = null;
          });
        }
        else if (user) {
          console.log(user);
          var uid = user.uid;

          var userRef = session.firebase.child('people').child(uid);
          userRef.child('displayName').set(user.displayName);
          userRef.child('email').set(user.email);
          userRef.child('uid').set(uid);

          if (user.provider === 'facebook') {
            userRef.child('avatar').set('https://graph.facebook.com/' + user.id + '/picture');
          }

          session.user = $firebase(userRef);
        }
        else {
          console.log('setting session to null')
          session.user = null;
        }

        $rootScope.$apply(function () {
          session.initialized = true;
        });
      });

      return session;
    }])