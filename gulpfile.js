var gulp = require('gulp');
var concat = require('gulp-concat');
var notify = require('gulp-notify');

var gutil      = require('gulp-util');
var coffee = require('gulp-coffee');
// var sass = require('gulp-sass');
var compass = require('gulp-compass');

var glob        = require('glob');
var browserify = require('gulp-browserify');
var watchify = require('watchify');
// var source = require('vinyl-source-stream');

var paths = {
	js: './src/scripts/*.js',
	jsFn: 'application.js',
	jsDest: './public/js',
	coffeeEntry: './src/scripts/mve_app.coffee',
	coffee: './src/scripts/*.coffee',

	sassEntry: './src/styles/application.scss',
	sass: './src/styles/*.scss',
	styles: './src/styles',
	sassDest: './public/css'
	// css: './public/css'
};

gulp.task('default', ['watch', 'scripts']);

gulp.task('greet', function () {
   console.log('Hello world!');
});

// The goal is to push all of the random ass save on builds that I have 
// sublime doing and make gulp and browserify do them instead...

/*

The things that need to happen --- 

read scripts from coffeescript



*/

// Scripts
// Load can.js and jquery into one file
// Load all other scripts into one big file


// Styles
// Compile all styles - from both font css files and scss files into one file

var handleErrors = function(){
	var args = Array.prototype.slice.call(arguments);

	// Send error to notification center with gulp-notify
	notify.onError({
	title: "Compile Error",
	message: "<%= error.message %>"
	}).apply(this, args);

	// Keep gulp from hanging on this task
	this.emit('end');
}


gulp.task('styles', function() {
	gulp.src(paths.sassEntry)
		.pipe(compass({
			css: paths.sassDest,
			sass: paths.styles
		}))
		.on('error', handleErrors)
		.pipe(gulp.dest(paths.sassDest))
});

gulp.task('scripts', function() {

	// return gulp.src(paths.js)
		// .pipe(concat(paths.jsFn))
		// .pipe(gulp.dest('./public/js'));

	return gulp.src(paths.coffeeEntry, {read: false})
 		.pipe(browserify( {transform: ['coffeeify'], extensions: ['.coffee'] }))
		.on('error', handleErrors)
 		.pipe(concat(paths.jsFn))
 		.pipe(gulp.dest(paths.jsDest));
});


gulp.task('watch', function() {
	gulp.watch(paths.coffee, ['scripts']);
	gulp.watch(paths.sass, ['styles']);
	// gulp.watch(paths.css, ['styles']); // Sass already compiles them all into one file
});










