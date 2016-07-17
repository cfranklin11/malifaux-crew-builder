'use strict';

var gulp, browserify, sourcemaps, source, buffer, watchify, babelify, browserSync, nodemon;

gulp = require("gulp");
browserify = require("browserify");
sourcemaps = require('gulp-sourcemaps');
source = require('vinyl-source-stream');
buffer = require('vinyl-buffer');
watchify = require('watchify');
babelify = require('babelify');
browserSync = require('browser-sync');
nodemon = require('gulp-nodemon');

gulp.task('styles', function() {
  return gulp.src(["app/index.html","app/lib/bootstrap-css/css/bootstrap.min.css","app/style.css"])
    .pipe(gulp.dest("app/build"));
});

gulp.task('watch-styles', function() {
  return gulp.watch(['app/*.html', 'app/*.css'], ['styles', 'reload']);
});

gulp.task('watch', function() {
  var bundler = watchify(browserify({
    entries: ['./app/main.jsx'],
    debug: true,
    transform: babelify.configure({presets: ['es2015', 'react']})
  }));

  function rebundle() {
    bundler.bundle()
      .on('error', function(err) { console.error(err); this.emit('end'); })
      .pipe(source('main.jsx'))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./app/build/'));
  }

  bundler.on('update', function() {
    console.log('-> bundling...');
    rebundle();
  });

  rebundle();
});

gulp.task('browser-sync', ['nodemon'], function() {
  browserSync({
    proxy: "localhost:3000",  // local node app address
    port: 5000,  // use *different* port than above
    notify: true
  });
});

gulp.task('nodemon', function (cb) {
  var called = false;
  return nodemon({
    script: './server/bin/www',
    ignore: [
      'gulpfile.js',
      'node_modules/'
    ]
  })
  .on('start', function () {
    if (!called) {
      called = true;
      cb();
    }
  })
  .on('restart', function () {
    setTimeout(function () {
      browserSync.reload({ stream: false });
    }, 1000);
  });
});

gulp.task('reload', function() {
  setTimeout(function () {
    browserSync.reload({ stream: false });
  }, 1000);
});

gulp.task('default', ['styles', 'watch-styles', 'watch', 'browser-sync']);