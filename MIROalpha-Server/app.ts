
/// <reference path='./typings/tsd.d.ts' />

/*
MIROBOT
Copyright(C) Ha Hyeon soo

*/

/********************************************
 * [Server module] 
 * 
 * TypeScript module -> import
 * JavaScript module -> var
 * 
 * install node_module -> ./node_modules 
 * open terminal with npm
 * 
 * npm install -d XXX (not -g)
 ********************************************/
 
//TypeScript Node.js module
import express = require('express');
import path = require('path');
import favicon = require('serve-favicon');
import logger = require('morgan');
import cookieParser = require('cookie-parser');
import bodyParser = require('body-parser');


/********************************************
 * [Router Path]
 * 
 * ./routes/~~~ .ts
 ********************************************/
import RobotBody = require('./routes/RobotBody');
import Code = require('./routes/Code');
import CamMonitor = require('./routes/CamMonitor');

/********************************************
 * [Express app section]
 * 
 * 
 ********************************************/
//Express App create
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/********************************************
 * [Router]
 * 
 * routes파일 내에서 독립적으로 수행한다.
 * 
 * app.use('/[URL_NAME]',[ROUTER_PATH])
 ********************************************/

app.use('/RobotBody', RobotBody);
app.use('/Code', Code);
app.use('/video', CamMonitor);

/********************************************
 * [Error Handler]
 * 
 * 404, 500
 ********************************************/

//catch 404 and forward to error handler
app.use((req, res, next) => {
   var err = new Error('Not Found');
   err['status'] = 404;
   next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {

   app.use((err: any, req, res, next) => {
       res.status(err['status'] || 500);
       res.render('error', {
           message: err.message,
           error: err
       });
   });
}

// production error handler
// no stacktraces leaked to user
app.use((err: any, req, res, next) => {
   res.status(err.status || 500);
   res.render('error', {
       message: err.message,
       error: {}
   });
});


//외부사용
export = app;
