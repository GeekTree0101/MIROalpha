/// <reference path='../typings/tsd.d.ts' />
"use strict";
/*
MIRO Cam Real Time monitor
Copyright(C) 2016 Ha Hyeon soo
*/
var express = require('express');
var fs = require('fs');
var raspicam = require('raspicam');
var io = require('socket.io').listen(5000);
var jimp = require('jimp');
var filtering = 1000; //color calculation filter
var camTask; //Cam task global variable for setInterval
var path = __dirname + '/../public/video/image.jpg'; //Path to raspicam capture
var cameraFlag = false;
var opencvFlag = false;
var cam = new raspicam({
    //cam option
    mode: "photo",
    width: 320,
    height: 240,
    encoding: "jpg",
    output: path,
    quality: 100,
    timeout: 0,
    preview: '0,0,320,240',
    timelapse: 200 //per time capture 
});
var router = express.Router(); //Communicate with app.ts
router.get('/', function (req, res, next) {
    console.log("get/img");
    if (cameraFlag == true) {
        res.render('camera', { title: 'cam' });
    }
});
router.get('/image', function (req, res, next) {
    if (cameraFlag == true) {
        var stream = fs.createReadStream(path);
        stream.pipe(res);
    }
});
/* Socket.io  Section */
io.sockets.on('connection', function (socket) {
    console.log("[+] CAM MONITOR connected");
    //1. RaspiCam Auto RUN
    socket.on('RUN', function (data) {
        console.log("[+CAM_RUN] target :", data);
        socket.emit("FEEDBACK", "[+CAM_RUN] target :" + data);
        cam.start(); //rapicam start    
        cameraFlag = true;
        if (opencvFlag == true) {
            camTask = setInterval(function () {
                var outputGreen = 0;
                var outputRed = 0;
                jimp.read(path, function (err, image) {
                    //RGB Image Processing Algorythm [RGB to VSH converter]
                    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
                        var r = this.bitmap.data[idx];
                        var g = this.bitmap.data[idx + 1];
                        var b = this.bitmap.data[idx + 2];
                        var max = Math.max(r, g, b);
                        var min = Math.min(r, g, b);
                        var V = max;
                        var S = (max != 0.0) ? (max - min) / max : 0.0;
                        var H;
                        if (S == 0.0) {
                            H = undefined;
                        }
                        else {
                            var delta = max - min;
                            if (r == max) {
                                H = (g - b) / delta;
                                H *= 60.0;
                                if (H < 0.0) {
                                    H += 360.0;
                                }
                                if (S > 0.7) {
                                    outputRed++;
                                }
                                else {
                                    this.bitmap.data[idx + 2] = 255;
                                    this.bitmap.data[idx] = 255;
                                    this.bitmap.data[idx + 1] = 255;
                                }
                            }
                            else if (g == max) {
                                H = 2.0 + (b - r) / delta;
                                if (S > 0.5) {
                                    outputGreen++;
                                }
                                else {
                                    this.bitmap.data[idx + 2] = 255;
                                    this.bitmap.data[idx] = 255;
                                    this.bitmap.data[idx + 1] = 255;
                                }
                            }
                            else if (b == max) {
                                H = 4.0 + (r - g) / delta;
                                H *= 60.0;
                                if (H < 0.0) {
                                    H += 360.0;
                                }
                                this.bitmap.data[idx + 2] = 255;
                                this.bitmap.data[idx] = 255;
                                this.bitmap.data[idx + 1] = 255;
                            }
                        }
                    });
                    console.log("[Green] :" + outputGreen + " , RED :" + outputRed);
                    //Filtering for Robot Auto control
                    if ((outputGreen > filtering && outputRed > filtering) && Math.abs(outputGreen - outputRed) > filtering) {
                        if (outputGreen > outputRed) {
                            socket.broadcast.emit("STATE", "G"); // to code.js
                            socket.broadcast.emit("FEEDBACK", "[+] ROBOCOG : GREEN ");
                            console.log("[Green] :" + outputGreen + " , RED :" + outputRed);
                        }
                        else {
                            socket.broadcast.emit('STATE', "R");
                            socket.broadcast.emit("FEEDBACK", "[+] ROBOCOG : RED ");
                            console.log("Green :" + outputGreen + " , [RED] :" + outputRed);
                        }
                    }
                    image.write(__dirname + '/../public/video/jimp.jpg'); //make debug image
                });
            }, 1000);
        }
    });
    //2. RaspiCam STOP
    socket.on('STOP', function (data) {
        //cam stop
        cameraFlag = false;
        clearInterval(camTask);
        console.log('[-CAM_STOP]');
        socket.emit("FEEDBACK", "[-CAM_STOP]");
        cam.stop();
    });
    socket.on('CVFLAG', function (data) {
        opencvFlag = data;
        if (data == true) {
            socket.emit("FEEDBACK", "[+] CV Activated!");
        }
        else {
            socket.emit("FEEDBACK", "[-] CV Halted!");
        }
    });
});
module.exports = router;
//# sourceMappingURL=CamMonitor.js.map