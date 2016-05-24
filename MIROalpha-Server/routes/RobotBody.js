/// <reference path='../typings/tsd.d.ts' />
/*
MIRO Robot body
Copyright(C) 2016 Ha Hyeon soo
 */
"use strict";
//Import Modules
var express = require('express');
var io = require('socket.io').listen(3001); //socket port 3001
var serialport = require('serialport');
//Initial Setting
var router = express.Router();
var SerialPort = serialport.SerialPort;
var hardwareFlag = false; //serial port control R/W
var portName = []; //USB LIST array
var serialPort = null;
var auto_flag = false;
//Serial Port set
/* Socket.io  Section

1. MOVE : Robot moving
2. CATCH : Robot ball Catch
3. AUTO : AUTO moving
4. CON_TEST : Socket connection TEST

*/
/* Socket.io  Section*/
io.sockets.on('connection', function (socket) {
    console.log("[+] ROBOT BODY socket.io connected");
    socket.broadcast.emit("FEEDBACK", "[+] ROBOT[BODY] USER CONNECTED1");
    //CAM ACT
    socket.on('CAMACT', function (data) {
        //socket connect 5000 cam monitoring
        console.log("[+CAM] data : ", data);
        if (hardwareFlag == true) {
            serialPort.write(data, function () {
                //XXX: data handling with algorythm
                console.log('[+ CAMAUTO] serial send : ', data);
            });
        }
    });
    //CONNECTION TEST
    socket.on('CON_TEST', function (data) {
        //socket connection test socket.io
        console.log("[+CON_TEST]", "target : " + data);
        socket.on('CON_TEST', "1");
    });
    //ROBOT MOVE TASK
    socket.on('MOVE', function (data) {
        //robot move controller by socket.io
        console.log("[+ MOVE] recv : ", data);
        if (hardwareFlag == true) {
            serialPort.write(data, function () {
                console.log('[+ MOVE] serial send : ', data);
            });
        }
    });
    //ATTECK SOCKET    
    socket.on('ATTECK', function (data) {
        console.log("[+ ATTECK] recv : ", data);
        if (hardwareFlag == true) {
            serialPort.write(data, function () {
                console.log('[+ ATTECK] serial send : ', data);
            });
        }
    });
    //ROBOT CATCH TASK
    socket.on('CATCH', function (data) {
        //robot catch hand controller by socket.io
        console.log("[+ CATCH] recv : ", data);
        if (hardwareFlag == true) {
            serialPort.write(data, function () {
                //XXX: data handling with algorythm
                console.log('[+ CATCH] send : ', data);
            });
        }
    });
    //ROBOT AUTO TASK
    socket.on('AUTO', function (data) {
        //robot auto task controller by socket.io
        console.log("[+ AUTO] recv : ", data);
        //XXX: data on/off
        if (auto_flag == false) {
            socket.broadcast.emit("FEEDBACK", "[+] AUTO_MODE Activated!");
            auto_flag = true;
        }
        else {
            socket.broadcast.emit("FEEDBACK", "[-] AUTO_MODE Halt");
            auto_flag = false;
        }
        if (hardwareFlag == true) {
            serialPort.write(data, function () {
                //XXX: data handling with algorythm
                console.log('[+ AUTO] send : ', data);
            });
        }
    });
    //USB LIST CHECK TASK
    socket.on('USBLIST', function (data) {
        //check USB list and save at array
        var serialportList = serialport.list(function (err, ports) {
            console.log("\n[+] USB LIST \n");
            if (portName.length > 0) {
                //del cached usb list
                var len = portName.length;
                for (var i = 0; i < len; i++) {
                    portName.pop();
                }
            }
            ports.forEach(function (port) {
                if (port.pnpId != undefined) {
                    portName.push(port.comName);
                    console.log("[+] Connected Serial :", port.comName);
                    console.log("[++] Infomation : ", port.pnpId);
                }
            });
        });
        console.log("[+] USER call USBLIST", portName);
        socket.emit('USBLIST', portName);
        socket.emit('FEEDBACK', "[+]Port list : " + portName);
    });
    //USB CONNECTION TASK
    socket.on('USBCONNECT', function (data) {
        //usb connection
        console.log("[+] USER call USBCONNECT", data);
        var success = "[+] USBCONNECT on BODY Success";
        if (portName.length > 0) {
            serialPort = new SerialPort(data, {
                baudrate: 9600,
                dataBits: 8,
                parity: 'none',
                stopBits: 1,
                flowControl: false
            });
            //open port
            serialPort.on("open", function () {
                console.log("[+] Connected BODY:" + data);
                hardwareFlag = true;
                socket.emit('FEEDBACK', success);
            });
        }
        else {
            console.log("[-] Please Connect Robot body");
            success = "Failed!";
            socket.emit('FEEDBACK', success);
        }
    });
    //USB DISCONNECTION TASK 
    socket.on('USBDISCONNECT', function (data) {
        //serial port disconnection
        console.log("[-] Disconnect BODY USB");
        //serial port close
        serialPort.close(function () {
            hardwareFlag = false;
            socket.emit('FEEDBACK', "ROBOT BODY Disconnect");
        });
    });
});
/* GET */
router.get('/', function (req, res, next) {
    console.log("[+] User access IoTcontrol session!");
});
/* POST */
router.post('/', function (req, res, next) {
});
module.exports = router;
//# sourceMappingURL=RobotBody.js.map