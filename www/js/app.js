
angular.module('starter', ['ionic', 'firebase', 'starter.controllers', 'starter.services', 'ngCordova'])

.run(function($ionicPlatform, $rootScope, $firebaseAuth, $firebase, $window, $ionicLoading) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    // firebase
    $rootScope.userEmail = null;
    $rootScope.baseUrl = 'https://lingotag-b0ede.firebaseio.com/';

    var authRef = new Firebase($rootScope.baseUrl);
    $rootScope.auth = $firebaseAuth(authRef);

    $rootScope.show = function(text) {
      $rootScope.loading = $ionicLoading.show({
        content: text ? text : 'Loading..',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
      });
    };

    $rootScope.hide = function() {
      $ionicLoading.hide();
    };

    $rootScope.notify = function(text) {
      $rootScope.show(text);
      $window.setTimeout(function() {
        $rootScope.hide();
      }, 1999);
    };

    $rootScope.logout = function() {
      $rootScope.auth.$logout();
      $rootScope.checkSession();
    };

    $rootScope.checkSession = function() {
      var auth = new FirebaseSimpleLogin(authRef, function(error, user) {
        if (error) {
          // no action yet.. redirect to default route
          $rootScope.userEmail = null;
          $window.location.href = '#/auth/signin';
        } else if (user) {
          // user authenticated with Firebase
          $rootScope.userEmail = user.email;
          $window.location.href = ('#/languages');
        } else {
          // user is logged out
          $rootScope.userEmail = null;
          $window.location.href = '#/auth/signin';
        }
      });
    }

  });
})

.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
  /*$httpProvider.defaults.headers.post['Authorization'] = 'Bearer dAYYVFSe3iCEgLGF5gGPDEajpMH2NU';
  $httpProvider.defaults.headers.post['Content-Type'] = 'multipart/form-data';*/


  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html',
    controller: 'PhotoCtrl'
  })

  // Each tab has its own nav history stack:

    .state('auth', {
      url: "/auth",
      abstract: true,
      templateUrl: "templates/auth.html"
    })
    .state('auth.signin', {
      url: '/signin',
      views: {
        'auth-signin': {
          templateUrl: 'templates/auth-signin.html',
          controller: 'SignInCtrl'
        }
      }
    })
    .state('auth.signup', {
      url: '/signup',
      views: {
        'auth-signup': {
          templateUrl: 'templates/auth-signup.html',
          controller: 'SignUpCtrl'
        }
      }
    })

  .state('tab.photo', {
    url: '/photo',
    views: {
      'tab-photo': {
        templateUrl: 'templates/tab-photo.html',
      }
    }
  })

  .state('tab.tagselect', {
         url: '/tagselect',
         reload: false,
     views: {
         'tab-tagselect' :{
             templateUrl: 'templates/tab-tagselect.html'
         }
     }

   })

  .state('tab.languages', {
      url: '/languages',
      views: {
        'tab-languages': {
          templateUrl: 'templates/tab-languages.html',
          controller: 'LanguagesCtrl'
        }
      }
    })

  .state('tab.cards', {
    url: '/cards',
    views: {
      'tab-cards': {
        templateUrl: 'templates/tab-cards.html',
        controller: 'CardsCtrl'
      }
    }
  })


  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/auth/signin');

});
