/* This gulp file deals with compiling and watching 
 * the sass/css and js files for any front end devs
 */
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

gulp.task('es6', function(done) {
    glob('./app/main-**.js', function(err, files) {
        if(err) done(err);

        var tasks = files.map(function(entry) {
            return browserify({ entries: [entry] })
                .bundle()
                .pipe(source(entry))
                .pipe(rename({
                    extname: '.bundle.js'
                }))
                .pipe(gulp.dest('./dist'));
            });
        es.merge(tasks).on('end', done);
    })
});


gulp.task('watch', function() {
    gulp.watch('staticSrc/sass/**/*.scss', ['sass']);
});


gulp.task('default', ['sass','watch']);