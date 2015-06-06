var gulp = require('gulp'),
    sass = require('gulp-sass'),
    globbing = require('gulp-css-globbing'),
    autoprefixer = require('gulp-autoprefixer'),
    nodemon = require('gulp-nodemon'),
    exec = require('child_process').exec;

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

//Run by 'gulp' this watches for any sass changes then only runs the sass task, nothing else needs to run.
gulp.task('watch-styles', function() {
  gulp.watch('sass/*.scss', ['sass']);
});

/*
 * This task starts a MongoDB server.
 * It should only start the server if there isn't one running already
 * (this sometimes happens if there was an error in the last start up)
 */
gulp.task('startDB', function () {
	exec('mongod', function (err, stdout, stderr) {
		console.log('Gulp startDB: ', stdout);
		console.log('Gulp startDB err: ', stderr);
		cb(err);
	});
});


/*
 * This task starts the Node.js server,
 * It should restart when anything server side changes
 *     server.js, passport.js, routes, controllers (although they're not set up yet), & models
 */
gulp.task('startNODE', function () {
    return nodemon({
        script: 'server.js',
        env: { 'NODE_ENV': 'development' },
        watch: ['server.js', 'passport.js', 'routes/']
    })
});


/*
 * This runs all the gulp tasks in order
 */
gulp.task('default', ['sass','startDB','startNODE','watch-styles']);