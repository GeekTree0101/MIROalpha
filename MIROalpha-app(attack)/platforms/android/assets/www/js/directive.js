angular.module('starter.directive', [])


.factory('Developer', function(){
    

    return{
        
    
        open : function(app){
            console.log("[+] open model");
            app.devModal.show();
        },
        
        close : function(app){
            console.log("[-] close model");
            app.devModal.hide();
        }
        
    }
    
})


.factory('Connection', function( $ionicPopup, $timeout, socketIo){
    //Connection test
    var alertState = {
        title : "",
        template: ""
    }
 
 
 
    return {
        check : function(state){
            console.log("[*] check",state);
            
            if(state == true){
                alertState.title = "IO connected!";
                alertState.template = "Connected MIROalpha Server!";
            }
            else{
                alertState.title = "ERROR : IO disconnected!";
                alertState.template = "Please open MIROalpha Server!";
            }
            
            
            var showState = $ionicPopup.alert({
                title: "<b>" + alertState.title + "</b>",
                template : "<center>" + alertState.template + "</center>"
            })
        }
    }
})






