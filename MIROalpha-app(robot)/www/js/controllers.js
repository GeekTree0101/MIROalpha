angular.module('starter.controllers', [])


.controller('AppCtrl', function($scope, $ionicModal, $timeout,$window , Moving, Connection, Storage, Developer, socketIo) {

  //Application Mainview control
 $ionicModal.fromTemplateUrl('templates/dev.html', {
     scope: $scope
    }).then(function(modal) {
        console.log("[+] set model");     
        $scope.devModal = modal;
    });   
  
 // Triggered in the login modal to close it

 this.closeDev = function(){
     navigator.vibrate(200);
     Developer.close($scope)
    };

 // Open the login modal
 this.openDev = function(){
     navigator.vibrate(200);
     Developer.open($scope)
    };
 
 
 this.connection = function(){
     navigator.vibrate(200);
     Connection.check(socketIo.stateCheck())
  };

 this.setup = function(){
     Storage.setting();
     $window.location.reload();
    } 
 
 this.data = Storage.load();
 
 this.autoMode = function(){
     if(this.autochecked == false){
        this.autochecked = true;
        Moving.auto(this.autochecked, socketIo.loadIo());
     }
     else{
         this.autochecked = false;
         Moving.auto(this.autochecked, socketIo.loadIo());         
     }
    };
    
 this.autochecked = false;  

})


.controller('action', function($scope, $interval, Moving, Storage, socketIo){
    var force = 100;
    var promise;
    var io;
    var count = 0;
    this.connect = socketIo.connect();
 

   this.onTouch = function(state){
      
       promise = $interval(function(){
           Moving.move(state,socketIo.loadIo());
           console.log(force);
           if(count < 90 && !(210-force-count < 10)){
             count ++;  
           }
       },210-force-count)
    }
    
    this.onRelease = function(){
        $interval.cancel(promise);
        count = 0;
    }
    
    this.power = function(){
        var temp = document.getElementById("power").value;
        force = temp;
    }
})
