var gulp = require('gulp');
var concat = requre('gulp-concat');


var glob        = require('glob');


var coffee = require('gulp-coffee');
var sass = require('gulp-sass');

var browserify = require('browserify');
var watchify = require('watchify');

var source = require('vinyl-source-stream');

var paths = {
	js: './src/scripts/*.js'
	// css: './public/css'
}

gulp.task('default', ['watch', 'scripts']);

gulp.task('greet', function () {
   console.log('Hello world!');
});

// The goal is to push all of the random ass save on builds that I have 
// sublime doing and make gulp and browserify do them instead...



// Scripts
// Load can.js and jquery into one file
// Load all other scripts into one big file


// Styles
// Compile all styles - from both font css files and scss files into one file



gulp.task('scripts', function() {
	return browserify(paths.js)
		.bundle()
		.pipe(source('application.js'))
		.pipe(gulp.dest('./public/js'))
});


gulp.task('watch', function() {
	gulp.watch(paths.js, ['scripts']);
	// gulp.watch(paths.css, ['styles']); // Sass already compiles them all into one file
})