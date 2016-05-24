'use strict';
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var webserver  = require('gulp-webserver');
var watch = require('gulp-watch');
var usemin = require('gulp-usemin');
var minifyCss  = require('gulp-minify-css');
var minifyHtml = require('gulp-minify-html');
var babel = require('gulp-babel');
var crisper = require('gulp-crisper')
var runSequence = require('run-sequence');
var vulcanize = require('gulp-vulcanize');
var minifyInline = require('gulp-minify-inline');
var path = require('path');
var del = require('del');

gulp.task('component-js', function(){
	return gulp.src('./build/components/**/*.js')
	.pipe(babel())
	.pipe(uglify())
	.pipe(gulp.dest('./build/components'))
})

gulp.task('component-html', function(){
	return gulp.src(['./app/components/**/*.html', '!./app/components/polymer'])
	.pipe(crisper({scriptInHead:false}))
	.pipe(gulp.dest('./build/components'))
})

gulp.task('vulcanize', function(){
  return gulp.src('./app/components/**/*.html')
    .pipe(vulcanize({
      inlineScripts: true,
      inlineCss: true,
      stripExcludes: false,
      excludes: [path.resolve('../components/polymer/polymer.html')]
    }))
    .pipe(minifyInline())
    .pipe(gulp.dest('./build/components'));	
})

gulp.task('sass', function () {
  gulp.src('./app/scss/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(minifyCss())
    .pipe(gulp.dest('./build/css'));
});

gulp.task('usemin', function () {
    return gulp.src('./app/index.html')
	.pipe(usemin({
	    vendorjs: [uglify()],
	 	appjs: [uglify(babel())]
	}))
	.pipe(gulp.dest('./build'));
});


gulp.task('server', function() {
    return gulp.src('./build')
	.pipe(webserver({
		host: '0.0.0.0',
	    livereload: true
	}))
});

gulp.task('clean', function (done) {
	del(['./build'], done);
});

gulp.task('clean-components', function(done){
	del(['./build/components'], done);
})

gulp.task('copyimg', function () {
    gulp.src(['./app/img/**/*.*'])
	.pipe(gulp.dest('./build/img'));
});

gulp.task('copysounds', function () {
    gulp.src(['./app/sounds/**/*.*'])
	.pipe(gulp.dest('./build/sounds'));
});

gulp.task('copyfonts', function () {
    gulp.src(['./app/fonts/**/*.*'])
	.pipe(gulp.dest('./build/fonts'));
});

gulp.task('bundlepolymer', function(){
	gulp.src('./bower_components/polymer/*.*')
	.pipe(gulp.dest('./build/polymer'));
})

gulp.task('build', function(){
	runSequence('clean','sass','usemin','component-html','component-js','copyimg','copysounds','copyfonts','bundlepolymer');
})

gulp.task('watch', ['server'], function(){
	gulp.watch(['app/js/**/*.js','app/scss/**/*.scss','app/*.html'],function(){
		runSequence('sass','usemin');
	});
	gulp.watch(['app/img/**/*.*'],function(){
		runSequence('copyimg');
	});
	gulp.watch(['./app/components/**/*.*'],function(){
		runSequence('clean-components','component-html','component-js');
	});
})