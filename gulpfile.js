/* This gulp file deals with compiling and watching 
 * the sass/css and js files for any front end devs
 */
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    globbing = require('gulp-css-globbing'),
    autoprefixer = require('gulp-autoprefixer'),
    browserify = require('browserify'),
    source     = require('vinyl-source-stream'),
    rename     = require('gulp-rename'),
    glob       = require('glob'),
    es         = require('event-stream'),
    jslint = require('gulp-jslint'),
    svgSprite  = require('gulp-svg-sprite');


gulp.task('sass', function() {
  return gulp.src('staticSrc/sass/main.scss')
    .pipe(globbing({
        extensions: ['.scss']
    }))
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
    .pipe(gulp.dest('static/css'));
});

gulp.task('watch:sass', function() {
    gulp.watch('staticSrc/sass/**/*.scss', gulp.series('sass'));
});


gulp.task('es6', function(done) {
    glob('./staticSrc/es6/**.js', function(err, files) {
        if(err) done(err);

        var tasks = files.map(function(entry) {
            console.log('entry: ', entry);
            return browserify({ entries: [entry] })
                .bundle()
                .pipe(source(entry))
                .pipe(rename({
                    dirname: '',
                    extname: '.bundle.js'
                }))
                .pipe(gulp.dest('./static/js'));
            });
        es.merge(tasks).on('end', done);
    })
});

gulp.task('watch:es6', function() {
    gulp.watch('staticSrc/es6/**/*.js', gulp.series('es6'));
});

var svgConfig = {
    svg:{
        rootAttributes: {width: 0, height: 0, display: 'none'}
    },
    mode: {
        symbol: {
            dest: '.',
            //sprite : 'vector.spritesheet.svg',
            sprite : 'svgs.hbs',
            /*example: {
                template: src + '/sprites/vector.example.html',
                dest: 'vector.example.html'
            }*/
            example: null
        }
    }
}

gulp.task('svg', function () {

    return gulp.src('staticSrc/svgs/**.svg')
        .pipe(svgSprite(svgConfig))
        .pipe(gulp.dest('server/views/partials/'));
});

gulp.task('watch:svg', function() {
    gulp.watch('staticSrc/svgs/**.svg', gulp.series('svg'));
});


gulp.task('watch', gulp.parallel('watch:sass', 'watch:es6', 'watch:svg'));
gulp.task('default', gulp.series('sass','es6','svg','watch'));
