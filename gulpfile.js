var gulp = require('gulp');
var sass = require('gulp-sass');
var compass = require('gulp-compass');
var coffeeify = require('gulp-coffeeify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var path = require('path');

var options = {
    sass_route: './src/styles',
    sass_dest: './public/css',
    js_route: './src/scripts',
    js_dest: './public/js',
    js_entry: 'base.js'
};
 
gulp.task('sass', function () {
    gulp.src(options.sass_route + '/*.scss')
        .pipe(sass())
        .pipe(gulp.dest(options.sass_dest));
});

// TODO -- concat into one style folder
gulp.task('watch', function(){
	gulp.watch(options.sass_route + '/*.scss', ['compass']);
	gulp.watch(options.js_route + '/*.coffee', ['scripts']);
});


// This replaces the sass thing
gulp.task('compass', function() {
  gulp.src(options.sass_route + '/*.scss')
    .pipe(compass({
      project: path.join(__dirname, ''),
      // css: options.sass_route,
      sass: options.sass_route
    }))
    .on('error', function(err) {
            // Would like to catch the error here
            console.log("You messed up");
        })
    .pipe(gulp.dest(options.sass_dest));
});


 
// Basic usage 
gulp.task('scripts', function() {
    gulp.src(options.js_route + '/*.coffee')
        .pipe(coffeeify())
        .pipe(gulp.dest(options.js_dest));
});

// // This task compiles everything in content_script into app.js
// // content_script should be the access point
// gulp.task('browserify', function() {
//     // console.log("FOOO");

//     var b = browserify();
//     b.add('./js_src/application.js');

//     return b.bundle()
//         .on('error', function(err) { 
//             console.log(err); 
//             this.emit('end');
//         })
//         //Pass desired output filename to vinyl-source-stream
//         .pipe(source('app.js'))
//         .pipe(gulp.dest('./js'));
// });

// have it just watch when just 'gulp' is put in the command line
gulp.task('default', ['watch']);
