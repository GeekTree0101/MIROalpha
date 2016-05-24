/// <reference path='../typings/tsd.d.ts' />
"use strict";
/*
MIRO Code uploader and dev tool
Copyright(C) 2016 Ha Hyeon soo
*/
var express = require('express');
var fs = require('fs');
var io = require('socket.io').listen(4000);
var pyCmd = require('python-shell');
var async = require('async');
var router = express.Router();
var robotCodeData = "";
var armCodeData = "";
//Arduino source file path
var robotFilePath = __dirname + '/../public/arduino/test/test.ino';
var armFilePath = __dirname + '/../public/arduino/test2/test2.ino';
var pioSrcPath = __dirname + '/../src/main.cpp';
var pyInterface = __dirname + '/../pio';
var backgroundImage = __dirname + '/../public/image/miro.png';
/* VIEW*/
router.get('/', function (req, res, next) {
    res.render('code', { title: 'Code' });
    robotCodeData = fs.readFileSync(robotFilePath, 'utf8');
    armCodeData = fs.readFileSync(armFilePath, 'utf8');
});
router.post('/', function (req, res, next) {
});
/* Socket.io  Section

1. UPLOAD : upload arduino file
2. CODE_SET : code post on server local file  // at POST send signal
3. CON_TEST : Socket connection TEST

*/
io.sockets.on('connection', function (socket) {
    console.log("[+] CODE socket.io connected");
    socket.on('CON_TEST', function (data) {
        console.log("[+CON_TEST]", "target : " + data);
        socket.emit('CON_TEST', "1");
    });
    socket.on('robotCODE', function (user) {
        console.log("[+ robotCODE]");
        socket.emit('FEEDBACK', "[+ robotCODE]");
        socket.emit('robotCODErecv', robotCodeData);
    });
    socket.on('armCODE', function (user) {
        console.log("[+ armCODE]");
        socket.emit('FEEDBACK', "[+ armCODE]");
        socket.emit('armCODErecv', armCodeData);
    });
    socket.on('SAVE', function (data) {
        var target = data[0];
        var uploadFile = data[1];
        if (target == "robotCode") {
            fs.writeFile(robotFilePath, uploadFile, function (err) {
                if (err) {
                    console.log(err);
                }
                socket.emit("FEEDBACK", "[+] robotCode upload Sucess!");
                socket.emit("SAVE", "");
            });
        }
        else if (target == "armCode") {
            fs.writeFile(armFilePath, uploadFile, function (err) {
                if (err) {
                    console.log(err);
                }
                socket.emit("FEEDBACK", "[+] armCode upload Sucess!");
                socket.emit("SAVE", "");
            });
        }
        else {
            socket.emit("FEEDBACK", "[-] Upload Failed!!!");
            socket.emit("SAVE", "");
        }
    });
    socket.on('UPLOAD', function (data) {
        var target = data[0];
        var portname = data[1];
        var uploadFile = data[2];
        console.log("[+] UPLOAD");
        console.log("[*] target :", target);
        console.log("[*] serialport:", portname);
        console.log("[*] uploadFile:", uploadFile);
        async.waterfall([
            function (callback) {
                //code save
                if (target == "robotCode") {
                    fs.writeFile(robotFilePath, uploadFile, function (err) {
                        if (err) {
                            console.log(err);
                        }
                        console.log("Sucess!");
                    });
                    callback(null);
                }
                else if (target == "armCode") {
                    fs.writeFile(armFilePath, uploadFile, function (err) {
                        if (err) {
                            console.log(err);
                        }
                        console.log("Sucess!");
                    });
                    callback(null);
                }
                else {
                    callback(null);
                }
            },
            function (callback) {
                //platformio src temp save
                fs.writeFile(pioSrcPath, uploadFile, function (err) {
                    if (err) {
                        socket.emit("FEEDBACK", err);
                        console.log(err);
                    }
                    console.log("[+] Set piosrc file!");
                    socket.emit("FEEDBACK", "[+] Set piosrc file!");
                    callback(null);
                });
            },
            function (callback) {
                //upload
                try {
                    //XXX : pyshell on
                    var board = target == "robotCode" ? "uno" : "uno";
                    var options = {
                        mode: 'text',
                        args: [board, portname],
                        scriptPath: pyInterface,
                        pythonOptions: ['-u']
                    };
                    pyCmd.run("miropi.py", options, function (err, results) {
                        if (err) {
                            socket.emit("FEEDBACK", "[-]Pio ERROR :" + err);
                        }
                        else {
                            socket.emit("FEEDBACK", "[+] UPLOAD SUCESS!!" + results);
                        }
                    });
                }
                catch (e) {
                    socket.emit("FEEDBACK", "[-]ERROR " + e);
                }
                callback(null);
            }
        ], function (err, results) {
        });
    });
});
module.exports = router;
//# sourceMappingURL=Code.js.map