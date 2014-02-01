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

      $scope.signin = function (provider) {
        session.login(provider, true);
      }

      $scope.signout = function () {
        session.logout();
        $location.path('/')
      }

      $scope.$watch('session.user.isMember', function() {
        if (session.user && session.user.isMember) {
          $rootScope.members = [];
          session.firebase.child('people').once('value', function (snap) {
            var obj = snap.val();
            $scope.$apply(function () {
              Object.keys(obj).forEach(function (key) {
                $rootScope.members.push(obj[key]);
              });
            })
          });
          session.firebase.child('family').once('value', function (snap) {
            var obj = snap.val();
            if (obj) {
              $scope.$apply(function () {
                Object.keys(obj).forEach(function (key) {
                  $rootScope.members.push(obj[key]);
                });
              });
            }
          });
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
        firebase: new Firebase(FIREBASE_ROOT_URL),
        user: null,
        initialized: false,
        redirectToMembersPage: false,
        login: function (provider, redirectToMembersPage) {
          session.redirectToMembersPage = redirectToMembersPage;
          auth.login(provider, {
            rememberMe: true,
            scope: 'email'
          });
        },
        logout: function () {
          auth.logout();
        }
      };

      var auth = new FirebaseSimpleLogin(session.firebase, function(error, user) {
        console.log(user, session.firebase);
        if (error) {
          console.log(error);
          $rootScope.$apply(function () {
            session.user = null;
          });
        }
        else if (user) {
          var uid = user.uid;

          var userRef = session.firebase.child('people').child(uid);

          userRef.once('value', function (userSnapRef) {
            var userSnap = userSnapRef.val();
            if (!userSnap || !userSnap.uid) 
              userRef.child('uid').set(uid);
            if (!userSnap || !userSnap.displayName) 
              userRef.child('displayName').set(user.displayName);
            if (user.email && (!userSnap || !userSnap.email))
              userRef.child('email').set(user.email);
          })

          if (user.provider === 'facebook') {
            userRef.child('avatar').set('https://graph.facebook.com/' + user.id + '/picture');
            userRef.child('provider').set('facebook');
          }
          else if (user.provider === 'twitter') {
            userRef.child('avatar').set(user.profile_image_url);
            userRef.child('provider').set('twitter');
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

$(document).ready(function() {
  /*============================================
  ScrollTo Links
  ==============================================*/
  $('a.scrollto').click(function(e){
    console.log(this.hash)
    $('html,body').scrollTo(this.hash, this.hash, {gap:{y:-80}});
    e.preventDefault();

    if ($('.navbar-collapse').hasClass('in')){
      $('.navbar-collapse').removeClass('in').addClass('collapse');
    }
  });

  /*============================================
  Navigation Functions
  ==============================================*/
  if ($(window).scrollTop()===0){
    $('#main-nav').removeClass('scrolled');
  }
  else{
    $('#main-nav').addClass('scrolled');
  }

  $(window).scroll(function(){
    if ($(window).scrollTop()===0){
      $('#main-nav').removeClass('scrolled');
    }
    else{
      $('#main-nav').addClass('scrolled');
    }
  });
})