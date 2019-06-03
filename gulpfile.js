var gulp = require('gulp'),
	//watch = require('gulp-watch'),
	less = require('gulp-less'),
	concat = require('gulp-concat'),
	cleanCSS = require('gulp-clean-css'),
	sourcemaps = require('gulp-sourcemaps'),
	rename = require('gulp-rename'),
	gulpinclude = require('gulp-file-include'),
	browserSync = require('browser-sync');
//browserSyncReuseTab = require('browser-sync-reuse-tab')(browserSync);

const server = browserSync.create();

const path = {
	build: { //куда складывать готовые после сборки файлы
		html: 'build/',
		css: 'build/css/'
	},
	src: { //откуда брать исходники
		html: 'src/*.html',
		style: 'src/less/styles.less'
	},
	watch: { //за изменением каких файлов мы хотим наблюдать
		html: 'src/**/*.html',
		style: 'src/less/**/*.less'
	}
};

function serve(done) {
	server.init({
		port: 3009,
		server: {
			baseDir: './build'
		},
		notify: true,
		open: true
	});
	done();
};

function reload(done) {
	server.reload();
	done();
};

function fileinclude() {
	return gulp.src(path.src.html)
		.pipe(gulpinclude({
			prefix: '@@',
			basepath: '@file'
		}))
		.pipe(gulp.dest(path.build.html));
};

function lessPack() {
	return gulp.src(path.src.style)
		.pipe(sourcemaps.init())
		.pipe(less())
		.pipe(concat('main.min.css'))
		.pipe(cleanCSS())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(path.build.css));
};

function watch() {
	gulp.watch(path.watch.html, gulp.series(fileinclude, reload));
	gulp.watch(path.watch.style, gulp.series(lessPack, reload));
};

gulp.task('default', gulp.series(fileinclude, lessPack, serve, watch));