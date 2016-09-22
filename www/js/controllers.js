angular.module('starter.controllers', [])

.controller('PhotoCtrl', function($scope, $state) {
    $scope.src = 'http://www.fillmurray.com/200/300';
    
    $scope.takePhoto = function(){
        navigator.camera.getPicture(onSuccess, onFail,{destinationType: Camera.DestinationType.FILE_URI})
    }
     
    function onSuccess(imgURI){
        $scope.src = imgURI;
        $state.reload();
    }
    function onFail(message) {
        alert('Failed because: ' + message);
    }
})

.controller('LanguagesCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
