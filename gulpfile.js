'use strict';
const gulp = require('gulp');
const watch = require('gulp-watch');
const browserSync = require('browser-sync');
const reload =  browserSync.reload;

gulp.task('html', function() {
  return gulp.src('index.html')
  .pipe(reload({stream:true}));
});

gulp.task('css', function() {
  return gulp.src('style.css')
  .pipe(reload({stream:true}));
});

gulp.task('js', function() {
  return gulp.src('script.js')
  .pipe(reload({stream:true}));
});

gulp.task('watcher', function() {
  gulp.watch('index.html', ['html']);
  gulp.watch('style.css', ['css']);
  gulp.watch('script.js', ['js']);
});

gulp.task('browsersync', function() {
  browserSync({
    server: {
      baseDir: './'
    },
    port: 8080,
    open: true,
    notify: false
  });
});

gulp.task('default', ['watcher', 'browsersync']);
