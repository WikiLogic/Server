var gulp = require('gulp'),
    sass = require('gulp-sass'),
    globbing = require('gulp-css-globbing'),
    autoprefixer = require('gulp-autoprefixer');

gulp.task('sass', function() {
  return gulp.src('staticSrc/sass/main.scss')
    .pipe(globbing({
        extensions: ['.scss']
    }))
    .pipe(sass())
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
    .pipe(gulp.dest('static/css'));
});


gulp.task('watch', function() {
    gulp.watch('staticSrc/sass/**/*.scss', ['sass']);
});


gulp.task('default', ['sass','watch']);