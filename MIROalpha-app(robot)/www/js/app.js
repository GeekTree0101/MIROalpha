// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.directive', 'starter.service'])
.run(function($ionicPlatform) {
    
    
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    
    
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})


/*
제공하고자 하는 뷰를 설정한다.

.state(이름,{
    url : '/location',
    views: {                   <ion-nav-view name=[name] > ...
       '[name]' : {
           templateUrl :'templates/XXX.html
           controller : '[controller name]'
       }
})

*/
.config(function($stateProvider, $urlRouterProvider, $compileProvider) {
  $stateProvider
  
//Start app view
    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/main.html',
    controller: 'AppCtrl as app'
    })
  
/*
Bluetooth connect view
*/  
    .state('app.act', {
      url: '/act',
      views: {
        'menuContent': {
          templateUrl: 'templates/act.html',
          controller: 'action as act'
        }
      }
    })



// if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/act');
})



