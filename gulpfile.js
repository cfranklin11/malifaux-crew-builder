'use strict';

var gulp, browserify, sourcemaps, source, buffer, watchify, babelify,
  browserSync, nodemon, babel, Cache, cache, reactify;

gulp = require('gulp');
browserify = require('browserify');
sourcemaps = require('gulp-sourcemaps');
source = require('vinyl-source-stream');
buffer = require('vinyl-buffer');
watchify = require('watchify');
babelify = require('babelify');
reactify = require('reactify');
browserSync = require('browser-sync');
nodemon = require('gulp-nodemon');
babel = require('gulp-babel');
Cache = require('gulp-file-cache');

cache = new Cache();

gulp.task('styles', function() {
  return gulp.src(['app/src/index.html',
      'app/lib/bootstrap-css/css/bootstrap.min.css','app/src/style.css'])
    .pipe(gulp.dest('app/build'));
});

gulp.task('watch-styles', function() {
  return gulp.watch(['app/src/*.html', 'app/src/*.css'], ['styles', 'reload']);
});

gulp.task('watch', function() {
  var bundler = watchify(browserify({
      entries: ['./app/src/main.jsx'],
      debug: true
    })
    .transform(babelify, {presets: ['es2015', 'react']})
  );

  function rebundle() {
    bundler.bundle()
      .on('error', function(err) {console.error(err); this.emit('end');})
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

gulp.task('browser-sync', ['babel', 'nodemon'], function() {
  browserSync({
    proxy: 'localhost:3000',  // local node app address
    port: 5000,  // use *different* port than above
    notify: true
  });
});

gulp.task('nodemon', ['babel'], function () {
  var stream = nodemon({
    script: './server/build/bin/www',
    ignore: [
      'gulpfile.js',
      'node_modules/'
    ],
    watch: './server/src',
    tasks: ['babel', 'reload']
  });

  return stream;
});

gulp.task('babel', function() {
  var stream = gulp.src('./server/src/**/*.js') // your ES2015 code
    .pipe(sourcemaps.init())
    .pipe(cache.filter()) // remember files
    .pipe(babel({presets: ['es2015']})) // compile new ones
    .pipe(cache.cache()) // cache them
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./server/build')); // write them

  return stream; // important for gulp-nodemon to wait for completion
});

gulp.task('reload', function() {
  setTimeout(function () {
    browserSync.reload({ stream: false });
  }, 1000);
});

gulp.task('default', ['styles', 'watch-styles', 'watch', 'browser-sync']);