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
          $scope.memberType = session.user.memberType;
          $scope.familyMemberIds = [];
          $scope.familyMembers = [];
          $scope.updateFamilyMemberList();
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

      $scope.addFamilyMember = function () {
        var uid = session.user.uid + '-' + Math.random().toString(36).substr(2,9);
        session.firebase.child('family').child(uid).set({
          displayName: '',
          email: '',
          phone: '',
          uid: uid
        });
        session.user.$child('familyMembers').$child(uid).$set(true);
        $scope.updateFamilyMemberList();
      }

      $scope.removeFamilyMember = function (person) {
        $scope.saveFamily();
        session.firebase.child('family').child(person.uid).remove();
        session.user.$child('familyMembers').$remove(person.uid);
        $scope.updateFamilyMemberList();
      }

      $scope.saveFamily = function () {
        $scope.familyMembers.forEach(function (person) {
          console.log('saving', person);
          if (person.displayName)
            person.isMember = true;
          person.$save();
        });
      }

      $scope.updateFamilyMemberList = function () {
        $scope.familyMemberIds = session.user.$child('familyMembers').$getIndex();
        $scope.familyMembers = $scope.familyMemberIds.map(function(id) {
          return $firebase(session.firebase.child('family').child(id));
        });
      }

    }])

  // Join Controller
  .controller('JoinCtrl', ['$scope', '$firebase', 'session', '$http',
    function($scope, $firebase, session, $http) {

      $scope.$watch('session.user.uid', function() {
        if (session.user && session.user.uid) {
          $scope.email = session.user.email;
        }
      });

      $scope.beforeprocessJoin = function () {
        if (!validateEmail($scope.email)) {
          $scope.$apply(function () {
            setError('A valid email address is required :)');
          });
          return false;
        }

        // if an access code is provide, bypass the call to stripe
        // and pass the access code up to the server in processJoin
        if ($scope.accessCode) {
          $scope.processJoin(null, {});
          return false;
        }
        $scope.isBusy = true;
        setError();
        return true;
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
          type: $scope.type,
          email: $scope.email,
          accessCode: $scope.accessCode
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

      function validateEmail(email) { 
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
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
