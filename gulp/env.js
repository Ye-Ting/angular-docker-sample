/**
 * Created by yeting on 15/7/13.
 */
'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var $        = require('gulp-load-plugins')();
var jsonfile = require('jsonfile');

gulp.task('env:config:serve', function () {

  var env             = process.env.APP_ENV || 'local';
  process.env.APP_ENV = env;

});

gulp.task('env:config', function () {
  var env = process.env.APP_ENV || 'needReplace';

  return gulp.src(
    path.join(conf.paths.src, '/config.json')
  )
    .pipe($.ngConfig('app.config', {
      environment: env
    }))
    .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve/app/')));

});

gulp.task('env:replace', ['cdn'], function () {
  var envConfig   = jsonfile.readFileSync(path.join(conf.paths.src,
    '/config.json'));
  var needReplace = envConfig.needReplace;
  var env         = process.env.APP_ENV || 'local';

  var stream = gulp.src(
    path.join(conf.paths.dist, '/scripts/*.js')
  );
  for (var key in needReplace.config) {
    stream = stream.pipe(
      $.replace(
        needReplace.config[key],
        envConfig[env]['config'][key])
    );
    console.log(key, needReplace.config[key]);
    console.log(key, envConfig[env]['config'][key]);
  }

  return stream.pipe(gulp.dest(path.join(conf.paths.dist, '/scripts')));

});

gulp.task('cdn', function () {

  var cdn = process.env.APP_CDN || '';

  return gulp.src(
    path.join(conf.paths.dist, '*.html')
  )
    .pipe($.cdnizer({
      defaultCDNBase: cdn,
      //allowRev      : true,
      //allowMin      : true,
      files         : [
        'scripts/*.js',
        'styles/*.css'
      ]
    }))
    .pipe(gulp.dest(
      path.join(conf.paths.dist)
    ));
});
