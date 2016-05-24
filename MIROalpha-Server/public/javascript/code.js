/**
 * Code Interface
 * Copyright(C) 2016 Ha Hyeon soo
 */
//host

//global variable
var codeSocket;
var robotSocket;
var camSocket;
var presentCode = "";
var usbstate = [false, false];
var robotUSB;
var armUSB;
var IP;
//SOCKET READ FROM SERVER
(function(){

   "use strict";
 
 
 try{
     IP = prompt("Insert IP address");
 }
 finally{
   codeSocket= io(IP+ ':4000');
   camSocket = io(IP + ':5000'); // camSocket task
   robotSocket = io(IP + ':3001'); //body
 }
   //accept Code
   codeSocket.on('robotCODErecv',function(data){
      console.log("[arduino code]", data);
      presentCode = "robotCode";
      document.getElementById("code").innerHTML = data; 
   });

   codeSocket.on('armCODErecv',function(data){
      console.log("[arduino code2]", data);
      presentCode = "armCode";
      document.getElementById("code").innerHTML = data; 
   });   
  
   codeSocket.on('SAVE',function(data){
       console.log("reset");
        document.getElementById("code").innerHTML = " "; 
   })
   //connection test 
   codeSocket.on('CON_TEST',function(data){
       if(data == '1'){
           alert("Connected!");
       }
       else{
           alert("ERROR");
       }
   });
   
   //OUTPUT USBLIST
   robotSocket.on('USBLIST', function(data){
       console.log(data);
        document.getElementById("code").innerHTML = data; 
   })
   
   //RaspicamSocket codeSocket.io
   //relation with camSocketMonitor.ts

   camSocket.on("STATE",function(data){
       robotSocket.broadcast.emit("CAMACT",data);
       miroAlphaCore.output("[+] Cam check [B/R]: " + data); 
   });
   
   //CAMMAND
   
   robotSocket.on("FEEDBACK",function(data){
	console.log(data);
      miroAlphaCore.output(data); 
   });

   
   camSocket.on("FEEDBACK",function(data){
      console.log(data);
      miroAlphaCore.output(data); 
   });   
   
   codeSocket.on("FEEDBACK",function(data){
console.log(data);
      miroAlphaCore.output(data); 
   });
   
   console.log("[+] Code Interface activated!");
})();

/*USER CONTROL SECTION */
//codeSocket SEND TO SERVER
var app ={
   
    //CODE LOAD SIGNAL 
    robotCodeCall : function(){
        console.log("[+] calling robotCode");
        codeSocket.emit('robotCODE','call');
        
    },
    armCodeCall : function(){
        console.log("[+] calling armCode");
        codeSocket.emit('armCODE','call');
    },
    
    //CODE SAVE
    save : function(){
        console.log("[+] sava pre :" + presentCode);
        var data = document.getElementById("code").value;
        codeSocket.emit('SAVE',[presentCode,data]);
    },
    
    upload: function(){
        var portname;
        try{
            portname = prompt("insert port name");
        }
        finally{
            var uploadFile = document.getElementById("code").value;
            
            if(uploadFile.split(" ")[0] == ""){
                miroAlphaCore.output("Please Click robot or arm Code!"); 
            }
            else{
                codeSocket.emit('UPLOAD',[presentCode,portname,uploadFile]);
            }
        }
        
    },
    
    //CONNECTION STATE SIGNAL
    state : function(){
        codeSocket.emit('CON_TEST',"code");
    },
    
    //USB LIST LOAD SIGNAL
    usb : function(){
        robotSocket.emit('USBLIST',"usblist");
    
    },
    
    //USB CONNECTION SIGNAL
    usbConnect :function(){
        var data = document.getElementById("code").value;
        robotUSB = data;
        robotSocket.emit('USBCONNECT',data);
	
    },
    
    
    
    //USB DISCONNECTION SIGNAL
    usbDisconnect : function(){
        
        if(usbstate[0] == true){
            robotSocket.emit('USBDISCONNECT',"");
            usbstate[0] = false;
        }
  
    },
    
    camRun : function(){
        
        console.log("[+] running cam");
        camSocket.emit('RUN',"cam user");  
    },
    
    camStop : function(){
 
        console.log("[-] stop camSocket");
        camSocket.emit('STOP',"cam user");

    },

    openCVRun : function(){
 
        camSocket.emit('CVFLAG',true);

    },
    openCVStop : function(){
 
        camSocket.emit('CVFLAG',false);

    }
    
}



var miroAlphaCore ={
    

    data : {
        helpList : ["------------HELP LIST------------",
                    "autorun CV/Monitoring : you can do cvmode or cam monitoring mode",
                    "autostop cv/monitoring : you can stop cvmode or cam monnitoring mode",
                    "usbconnect [usbname] [target] : you can connect usb between arduino with miroalpha bot",
                    "upload [usbname] : you can upload arduino"
                   ]


    },


    cmd : function(){
        var cmdData = document.getElementById("cmd").value;
        var node = document.getElementById("list");
  
        var obj = document.createElement("li");
        var target = cmdData.split(" ");
        
        if(target[0] == "help"){
            console.log("help");
            var text = miroAlphaCore.data.helpList;
            for(var i = 0; i < text.length; i++){
		 obj.innerHTML = text[i];
                 node.appendChild(obj.cloneNode(true));
            }
           
        }
        
        if(target[0] == "clear"){
            var count = node.childElementCount;
            for(var i =0; i < count; i++){
                node.removeChild(node.childNodes[0]);
            }
         
            obj.innerHTML= "Clear!";
            node.appendChild(obj.cloneNode(true));
        }
        
        
        if(target[0]=="upload"){
            var uploadFile = document.getElementById("code").value;
            
            if(uploadFile.split(" ")[0] == ""){
                miroAlphaCore.output("Please Click robot or arm Code!"); 
            }
            else{
                codeSocket.emit('UPLOAD',[presentCode,target[1],uploadFile]);
            }
  
        }
        
        if(target[0] == "connect"){
            if(target[1] == "robotCode"){
                robotSocket.emit('USBCONNECT',target[2]);
            }
      
        }
        
    },
    cmdEnterPressed: function(){
          
          if(event.keyCode == 13){
               miroAlphaCore.cmd();
               return;
          }
    },
    output : function(data){
        var node = document.getElementById("list");
        var obj = document.createElement("li");
        console.log("cmd",data);
        obj.innerHTML = data;
        node.appendChild(obj.cloneNode(true));
    }
    
    
    
    
    
}
