angular.module('starter.controllers', [])


.controller('AppCtrl', function($scope, $ionicModal, $timeout,$window, Attack, Connection, Storage, Developer, socketIo) {

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
 
 this.rtcam = function(){
     navigator.vibrate([100,50,100,50,300]);
     var local = JSON.parse(localStorage.getItem('setAttack'))[0];
     window.open(local +":3000/video",'_blank', "location=no");
 }
    
 this.autochecked = false;  

})


.controller('action', function($scope, $interval, Attack, Storage, socketIo){
   
    var promise;
    var io;
    var ctl = false;
    this.connect = socketIo.connect();
  
    
 
    this.attack = function(){
        console.log("ATTACK");
        
        if(ctl){
            this.ui.state = this.ui.off;
            navigator.vibrate([50,50,50,50,50]);
            ctl = false;
        }
        else{
            this.ui.state = this.ui.on;
            navigator.vibrate([50,50,50,50,300]);
            ctl = true;
            
        }
        Attack.attack(socketIo.loadIo());
    }

    this.ui = {
        state : "button button-clear ion-flash button-dark",
        on : "button button-clear ion-flash button-assertive",
        off : "button button-clear ion-flash button-dark"
    }
  
})
