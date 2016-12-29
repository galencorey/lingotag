angular.module('starter.controllers', [])
.controller('SignUpCtrl', [
    '$scope', '$rootScope', '$firebaseAuth', '$window',
    function ($scope, $rootScope, $firebaseAuth, $window) {
      $scope.user = {
        email: "",
        password: ""
      };
      $scope.createUser = function () {
        var email = this.user.email;
        var password = this.user.password;

        if (!email || !password) {
          $rootScope.notify("Please enter valid credentials");
          return false;
        }

        $rootScope.show('Please wait.. Registering');
        $rootScope.auth.$createUser(email, password, function (error, user) {
          if (!error) {
            $rootScope.hide();
            $rootScope.userEmail = user.email;
            $window.location.href = ('#/bucket/list');
          }
          else {
            $rootScope.hide();
            if (error.code == 'INVALID_EMAIL') {
              $rootScope.notify('Invalid Email Address');
            }
            else if (error.code == 'EMAIL_TAKEN') {
              $rootScope.notify('Email Address already taken');
            }
            else {
              $rootScope.notify('Oops something went wrong. Please try again later');
            }
          }
        });
      }
    }
  ])
.controller('SignInCtrl', [
  '$scope', '$rootScope', '$firebaseAuth', '$window',
  function ($scope, $rootScope, $firebaseAuth, $window) {
     // check session
     $rootScope.checkSession();
     $scope.user = {
        email: "",
        password: ""
     };
     $scope.validateUser = function () {
        $rootScope.show('Please wait.. Authenticating');
        var email = this.user.email;
        var password = this.user.password;
        if (!email || !password) {
           $rootScope.notify("Please enter valid credentials");
           return false;
        }
        $rootScope.auth.$login('password', {
           email: email,
           password: password
        })
        .then(function (user) {
          $rootScope.hide();
          $rootScope.userEmail = user.email;
          $window.location.href = ('#/bucket/list');
        }, function (error) {
          $rootScope.hide();
          if (error.code == 'INVALID_EMAIL') {
            $rootScope.notify('Invalid Email Address');
          }
          else if (error.code == 'INVALID_PASSWORD') {
            $rootScope.notify('Invalid Password');
          }
          else if (error.code == 'INVALID_USER') {
            $rootScope.notify('Invalid User');
          }
          else {
            $rootScope.notify('Oops something went wrong. Please try again later');
          }
        });
     }
  }
])
.controller('PhotoCtrl', function($scope, $state, TagsFactory, StorageFactory) {
    $scope.src = 'http://placekitten.com/200/300';
    $scope.tags = [];
    $scope.showTrans = false;
    $scope.pictureTaken = false;
    $scope.isError = false;
    $scope.selectedTags = [];

    $scope.$on('$ionicView.enter', function(e) {
      if (!$scope.pictureTaken){
        navigator.camera.getPicture(onSuccess, onFail, {destinationType: Camera.DestinationType.DATA_URL});
      }
    });

    function onSuccess(imgURI){
      console.log("successsssssssssss")
        $scope.src = "data:image/gif;base64," + imgURI;
        $state.reload();
        $scope.imgData = imgURI;
        $scope.pictureTaken = true;
        // navigator.camera.cleanup();
    }

    function onFail(message) {
        alert('Failed because: ' + message);
    }


    $scope.showTags = function(){
        console.log("im gonna try to get some tags now")
        TagsFactory.getTags($scope.imgData)
        .then(function(tags){
          console.log('got some nice tags ', tags)
              $scope.tags = tags.slice(0,7);
              return TagsFactory.translateTags($scope.tags)
        })
        .then(function(translatedTags){
            $scope.tags = $scope.tags.map(function(tag, idx){
                  return {
                      english: tag,
                      translated: translatedTags[idx]
                  }
            });
            $state.go('tab.tagselect', {location: false});
        })
        .catch(function(err){
               $scope.isError = true;
               $scope.error = err;
        })
    }

    $scope.selectTag = function(tag){
        $scope.selectedTags.push(tag);
    }

    $scope.createCard = function(){
        StorageFactory.addCards($scope.selectedTags);
        $state.go('tab.cards');
    }
})


.controller('LanguagesCtrl', function($scope, $rootScope) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

        $scope.changeLang = function (language){
            $rootScope.language = language;
        }

})


.controller('CardsCtrl', function($scope, StorageFactory) {
        $scope.cards = StorageFactory.getAll();
        $scope.storage = localStorage;
        $scope.showTrans = false;

        $scope.$on('$ionicView.enter', function(e) {
            $scope.digest();
        });

//        $scope.viewSet = function(){
//            $state.go('tab.languages', {location: false});
//        }
});
