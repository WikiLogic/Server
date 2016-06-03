var gulp = require('gulp'),
    gutil = require('gulp-util'),
    sass = require('gulp-sass'),
    globbing = require('gulp-css-globbing'),
    autoprefixer = require('gulp-autoprefixer'),
    nodemon = require('gulp-nodemon'),
    karmaServer = require('karma').Server;

/*
 * This task compiles Sass into CSS
 * The server does not need to restart on styling changes.
 */
gulp.task('sass', function() {
  return gulp.src('sass/main.scss')
    .pipe(globbing({
        // Configure it to use SCSS files
        extensions: ['.scss']
    }))
    .pipe(sass())
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
    .pipe(gulp.dest('public/styles'));
});



/*
 * This task starts the Node.js server,
 * It should restart when anything server side changes
 *     server.js, passport.js, routes, controllers (although they're not set up yet), & models
 */
gulp.task('startNode', function () {
    nodemon({
        script: 'server.js',
        ignore: ['public/'],
        env: { 'NODE_ENV': 'development' }
    })
    .on('restart', function () {
      console.log('restarted!');
    })
    .on('error', gutil.log);;
});



/*
 * The watchers on the wall
 */
 //watch: ['server.js', 'passport.js', 'routes/']
gulp.task('watch', function() {
    console.log('GULP: watch');
    gulp.watch('sass/**/*.scss', ['sass']);
});

/*
 * The Karma test
 * Test files are beside their 'real life' counterparts
 */
gulp.task('test', function (done) {
    
    /*
    karmaServer.start({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, function() {
        done();
    });
    */

    new karmaServer({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done).start();
});

/*
 * The tasks to run - don't run gulp directly, instead use `npm start`
 */
gulp.task('dev', gulp.series('sass','startNode','watch'));
gulp.task('default', gulp.series('startNode'));