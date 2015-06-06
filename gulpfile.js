var gulp = require('gulp'),
    sass = require('gulp-sass'),
    globbing = require('gulp-css-globbing'),
    nodemon = require('gulp-nodemon'),
    exec = require('child_process').exec;

gulp.task('sass', function() {
  return gulp.src('sass/main.scss')
    .pipe(globbing({
        // Configure it to use SCSS files
        extensions: ['.scss']
    }))
    .pipe(sass())
    .pipe(gulp.dest('public/styles'));
});

gulp.task('startDB', function () {
	exec('mongod', function (err, stdout, stderr) {
		console.log(stdout);
		console.log(stderr);
		cb(err);
	});
});

gulp.task('startNODE', function () {
    return nodemon({
        script: 'server.js',
        env: { 'NODE_ENV': 'development' },
        watch: ['app.js']
    })
});

gulp.task('default', ['sass','startDB','startNODE']);