/****************************************************************************

  Gulp Task
  
  Copyright(C)2016 Ha Hyeon soo
  
  Watch
  JADE
  SASS
  TypeScript

******************************************************************************/

var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
//var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
//var sass = require('gulp-sass');
//var jade= require('gulp-jade');
var typescript = require('gulp-tsc');

/*****************************
           Task Path
******************************/
var paths = {
  src: ['./routes/*.ts'],
};



gulp.task('default',['tscompile']);

/*  gulp TypeScript task  */

gulp.task('tscompile', function() {
  gulp.src(paths.src)
    .pipe(typescript({
      emitError: false
    }))
    .pipe(gulp.dest('./routes'))
})

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});