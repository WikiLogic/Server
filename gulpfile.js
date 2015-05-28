var gulp = require('gulp'),
    sass = require('gulp-sass'),
    globbing = require('gulp-css-globbing');

gulp.task('sass', function() {
  return gulp.src('sass/main.scss')
    .pipe(globbing({
        // Configure it to use SCSS files
        extensions: ['.scss']
    }))
    .pipe(sass())
    .pipe(gulp.dest('public/styles'));
});

gulp.task('default', ['sass']);