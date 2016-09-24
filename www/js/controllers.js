angular.module('starter.controllers', [])

.controller('PhotoCtrl', function($scope, $state, TagsFactory, $log) {
    $scope.src = 'http://placekitten.com/200/300';
    $scope.tags = [];
    $scope.showTrans = false;
    $scope.pictureTaken = false;
            $scope.isError = false;
            
            
    $scope.takePhoto = function(){
            navigator.camera.getPicture(onSuccess, onFail, {destinationType: Camera.DestinationType.DATA_URL});
    }

    function onSuccess(imgURI){
        $scope.src = "data:image/gif;base64," + imgURI;
        $state.reload();
        $scope.imgData = imgURI;
        $scope.pictureTaken = true;
        navigator.camera.cleanup();
    }
            
    function onFail(message) {
        alert('Failed because: ' + message);
    }
            
            
    $scope.showTags = function(){
        TagsFactory.getTags($scope.imgData)
        .then(function(tags){
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
            

            
})


.controller('LanguagesCtrl', function($scope) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

})


.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
