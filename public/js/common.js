angular.module('rocktriclub', ['firebase', 'ngRoute', 'stripe'])

  // Main Controller
  .controller('MainCtrl', ['$scope', '$location',
    function($scope, $location) {

      $scope.isActive = function (viewLocation) {
        return viewLocation === $location.path();
      };
    }])

  .controller('UserStatus', ['$scope', '$rootScope', 'session', '$location', '$firebase',
    function($scope, $rootScope, session, $location, $firebase) {

      $rootScope.session = session;

      $scope.signin = function () {
        session.login(true);
      }

      $scope.signout = function () {
        session.logout();
        $location.path('/')
      }

      $scope.$watch('session.user.isMember', function() {
        if (session.user && session.user.isMember) {
          $rootScope.members = $firebase(session.firebase.child('people'));
        }
      });

    }])

  // User Status / login directive
  .directive('userStatus', function () {
    return {
      restrict: 'A',
      templateUrl: 'partials/userStatus.html',
      controller: 'UserStatus'
    }
  })

  // Session Factory
  .factory('session', ['$firebase', '$rootScope', '$location',
    function ($firebase, $rootScope, $location) {
      var session = {
        firebase: new Firebase('https://rocktriclub.firebaseio.com/'),
        user: null,
        initialized: false,
        redirectToMembersPage: false,
        login: function (redirectToMembersPage) {
          session.redirectToMembersPage = redirectToMembersPage;
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

          userRef.once('value', function (userSnapRef) {
            var userSnap = userSnapRef.val();
            if (!userSnap.uid) userRef.child('uid').set(uid);
            if (!userSnap.displayName) userRef.child('displayName').set(user.displayName);
            if (!userSnap.email) userRef.child('email').set(user.email);
          })

          if (user.provider === 'facebook') {
            userRef.child('avatar').set('https://graph.facebook.com/' + user.id + '/picture');
            userRef.child('provider').set('facebook');
          }

          session.user = $firebase(userRef);

          if (session.redirectToMembersPage) {
            console.log('redirecting')
            window.location = '/member';
          }
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