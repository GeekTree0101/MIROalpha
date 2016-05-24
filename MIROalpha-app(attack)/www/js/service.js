angular.module('starter.service', [])


.factory('socketIo', function(){
    
    var socket = "";
    var state = "";
    return{
        connect : function(){
            var IP = JSON.parse(localStorage.getItem('setAttack'))[0];
            IP = IP + ":3001";
            socket = io.connect(IP,{transports:['websocket','poling','flashsocket']});
            return socket;
                      
        },
        
        stateCheck : function(){
            state = socket.connected;
            return state;
        },
        
        loadIo :function(){
            
            return socket;
            
        }
    }
    
})


.factory('Storage', function(){
    //Temp data Storage
    
    var temp  = ['http://192.168.1.10',0];
    
        if(!localStorage.getItem("setAttack")){
            localStorage.setItem("setAttack", JSON.stringify(temp));
         }
        else{
            temp = JSON.parse(localStorage.getItem('setAttack'));
        }
    
    return{
        
        setting : function(){
            
            arr = []
            for(var i = 0; i < 2; i++){
                var target = document.getElementById('value' + i).value;
                arr.push(target);
                
            }
            console.log(arr);
            temp = JSON.parse(localStorage.getItem('setAttack'));
            
            for(var i = 0; i < 2; i++){
                temp[i] = arr[i];
            }
            console.log(temp)
            localStorage.setItem('setAttack', JSON.stringify(temp));
            console.log("[+] set data", temp);
        },
        
        load : function(){
            
            return JSON.parse(localStorage.getItem('setAttack')); //array format
        }
        
        
    }
    
})



.factory('Attack', function(){
    //MIRO alpha Robot body control
    
    var temp = JSON.parse(localStorage.getItem('setAttack'));

    return {

        attack : function(io){
            
            console.log("[+] Attack");
            io.emit("ATTECK", temp[1]);
 
        }
    }
})
