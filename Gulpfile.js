var gulp 					= require('gulp'),
	autoprefixer 			= require('gulp-autoprefixer'),
	cache 					= require('gulp-cache'),
	clean 					= require('gulp-clean'),
	concat 					= require('gulp-concat'),
	minifyCSS 				= require('gulp-minify-css'),
	plumber 				= require('gulp-plumber'),
	rename 					= require('gulp-rename'),
	sass 					= require('gulp-ruby-sass'),
	sequence 				= require('run-sequence'),
	uglify 					= require('gulp-uglify'),
	browserSync 			= require('browser-sync'),
	config 					= require('./config'),
	reload      			= browserSync.reload,

	/**
	 * If developing this package set to true but make sure you change it to false before
	 * deploying and re-run gulp
	 */

	local					= true,
	destination 			= 'public/assets/';


/**
 * setup stream for package's sass files
 * @return gulp object
 */

gulp.task( 'styles', function()
{
	var _gulp = gulp.src(config.paths.app.sass)
	.pipe( plumber() )
	.pipe( sass() )
	.pipe( autoprefixer( 'last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4' ) )
	.pipe( concat( 'app.bundle.css' ) );
	// don't bother with source map rubbish...
	if( ! local ) _gulp.pipe( minifyCSS() );
	_gulp.pipe( reload({ stream : true } ) );
	_gulp.pipe( gulp.dest( destination + 'css' ) );
	return _gulp;
});

/**
 * setup stream for package's javascript files
 * @return gulp object
 */

gulp.task( 'scripts', function()
{
	var _gulp = gulp.src(config.paths.app.js)
	.pipe( plumber() )
	.pipe( concat( 'app.bundle.js' ) );
	if( ! local ) _gulp.pipe( uglify() );
	_gulp.pipe( gulp.dest( destination + 'js' ) )
	_gulp.pipe( reload({ stream : true } ) );
	return _gulp;
});

/**
 * [description]
 * @return {[type]} [description]
 */

gulp.task( 'plugin_styles', function()
{
	var _gulp = gulp.src(config.paths.plugins.css)
	.pipe( plumber() )
	.pipe( concat( 'plugins.bundle.css' ) )
	.pipe( autoprefixer( 'last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4' ) );
	_gulp.pipe( minifyCSS() );
	_gulp.pipe( gulp.dest( destination + 'css' ) );
	return _gulp;
});

/**
 * [description]
 * @return {[type]} [description]
 */

gulp.task('browser-sync', function() {
    browserSync({
        proxy: config.domain
    });
});

/**
 * [description]
 * @return {[type]} [description]
 */

gulp.task( 'plugin_js', function(){
	var _gulp = gulp.src(config.paths.plugins.js)
	.pipe( plumber() )
	.pipe( concat( 'plugins.bundle.js' ) );
	_gulp.pipe( uglify() );
	_gulp.pipe( gulp.dest( destination + 'js' ) );
	return _gulp;
});

/**
 * [description]
 * @return {[type]} [description]
 */

gulp.task( 'clean', function()
{
	return gulp.src([
		destination + 'css',
		destination + 'js'
	], { read: false } )
	.pipe( clean({ force : true }) );
});

/**
 * [description]
 * @return {[type]} [description]
 */

gulp.task( 'watch', function () {
	gulp.watch( 'scss/**/*.scss', ['styles'] );
	gulp.watch( 'javascripts/*.js', ['scripts'] );
});

/**
 * [description]
 * @return {[type]} [description]
 */

gulp.task( 'default', ['clean','browser-sync'], function() {
        sequence( 'styles', 'plugin_styles', 'scripts', 'plugin_js', 'watch' );
});
