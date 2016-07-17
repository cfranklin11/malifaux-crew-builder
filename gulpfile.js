'use strict';

var gulp, browserify, reactify, sourcemaps, source, buffer, watchify, babelify;

gulp = require("gulp");
browserify = require("browserify");
sourcemaps = require('gulp-sourcemaps');
source = require('vinyl-source-stream');
buffer = require('vinyl-buffer');
watchify = require('watchify');
babelify = require('babelify');

function compile(watch) {
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

  function bundleStyles() {
    return gulp.src(["app/index.html","app/lib/bootstrap-css/css/bootstrap.min.css","app/style.css"])
      .pipe(gulp.dest("app/dist"));
  }

  if (watch) {
    bundler.on('update', function() {
      console.log('-> bundling...');
      rebundle();
      bundleStyles();
    });
  }

  rebundle();
  bundleStyles();
}

function watch() {
  return compile(true);
}

gulp.task('build', function() { return compile(); });
gulp.task('watch', function() { return watch(); });

gulp.task('default', ['watch']);