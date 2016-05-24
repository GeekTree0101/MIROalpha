angular.module('starter.service', [])


.factory('socketIo', function(){
    
    var socket = "";
    var state = "";
    return{
        connect : function(){
            var IP = JSON.parse(localStorage.getItem('set'))[0];
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
    
    var temp  = ['http://192.168.1.10',0,0,0,0,0,0];
    
        if(!localStorage.getItem("set")){
            localStorage.setItem("set", JSON.stringify(temp));
         }
        else{
            temp = JSON.parse(localStorage.getItem('set'));
        }
    
    return{
        
        setting : function(){
            
            arr = []
            for(var i = 0; i < 7 ; i++){
                var target = document.getElementById('value' + i).value;
                arr.push(target);
                
            }
            console.log(arr);
            temp = JSON.parse(localStorage.getItem('set'));
            for(var i = 0; i < temp.length; i++){
                temp[i] = arr[i];
            }
            console.log(temp)
            localStorage.setItem('set', JSON.stringify(temp));
            console.log("[+] set data", temp);
        },
        
        load : function(){
            
            return JSON.parse(localStorage.getItem('set')); //array format
        }
        
        
    }
    
})



.factory('Moving', function(){
    //MIRO alpha Robot body control
    
    var temp = JSON.parse(localStorage.getItem('set'));
    // 1 : left , 2 : right, 3: back, 4: forward, 5:catch 6:auto
    
    return {

        move : function(flag,io){
            
            console.log("[+] move", flag);
            navigator.vibrate(200);
            if(flag != "catch"){
                var act = "";
                switch(flag){
                    case "forward":
                        act = temp[4];
                    break;
                    case "back":
                        act = temp[3];
                    break;
                    case "left":
                        act = temp[1];
                    break;
                    case "right":
                        act = temp[2];
                    break;
                    case "break":
                        act = "break";
                }
                io.emit("MOVE", act);
               
            }
            else{
                io.emit("CATCH", temp[5]);
            }
            
        },
        
        auto : function(flag,io){
            console.log("[+] auto mode", flag);
            
            if(flag == true){
                navigator.vibrate([200,50,200,50,200]);
                io.emit("AUTO", temp[6]);
            }
            else{
                navigator.vibrate(1000);
                io.emit("AUTO", temp[6]);
            }
            
        }
    }
})
