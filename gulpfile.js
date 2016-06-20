/**
 * Created by SelcetStudio on 06/20/16.
 */

// Requires the gulp-sass plugin
var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var size = require('gulp-size');
var sourcemaps = require('gulp-sourcemaps');
var watch = require('gulp-watch');
var merge = require('merge-stream');
var del = require('del');

// This is an object which defines paths for the styles.
// The folder, files to look for and destination are all required for sass
var paths = {
	styles: {
		name: 'app',
		src: './app/scss',
		files: './app/scss/**/*.scss',
		dest: './app/css/',
		del: 'app/css/**/*'
	}
};

// Clean task
gulp.task('clean', function (cb) {
	del.sync([
		paths.styles.del,
		// we don't want to clean this file though so we negate the pattern
		'!app/css/deploy.txt'
	], cb);
});

// BrowserSync task
gulp.task('browserSync', function() {
	browserSync({
		server: {
			baseDir: 'app'
		}
	})
});

// Sass compilation
gulp.task('sass', function () {
	gulp.src(paths.styles.files)
		.pipe(sourcemaps.init())
		.pipe(sass.sync({
			sourceMap: true,
			sourceComments: 'normal'
		}).on('error', sass.logError))
		.pipe(sourcemaps.write('maps'))
		.pipe(size({ showFiles: true }))
		.pipe(gulp.dest(paths.styles.dest))
		.pipe(browserSync.reload({
			stream: true
		}))
});

// Sass watch
gulp.task('sass:watch', function () {
	gulp.watch(paths.styles.files, ['sass'])
});

//Watch task
gulp.task('default', ['browserSync', 'sass', 'sass:watch'], function (){
	// Reloads the browser whenever Scss files change
	gulp.watch(paths.styles.files, ['sass']);

	// Reloads the browser whenever HTML files change
	gulp.watch('app/*.html', browserSync.reload);

	// Reloads the browser whenever JS files change
	gulp.watch('app/scripts/**/*.js', browserSync.reload);
});