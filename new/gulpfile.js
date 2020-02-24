"use strict";

const gulp = require('gulp'),
	less = require('gulp-less'),
	concat = require('gulp-concat'),
	plumber = require('gulp-plumber'),
	prefix = require('gulp-autoprefixer'),
	cssImport = require('gulp-cssimport'),
	cmq = require('gulp-group-css-media-queries'),
	browserSync = require('browser-sync').create(),
	argv = require('yargs').argv,
	rename = require('gulp-rename'),
	includePartials = require('gulp-file-include'),
	prettyHtml = require('gulp-pretty-html'),
	gulpif = require('gulp-if'),
	cssmin = require('gulp-clean-css'),
	uglify = require('gulp-uglify'),
    babel = require('gulp-babel'),
	sourcemaps = require('gulp-sourcemaps'),
	del = require('del');

const config = {
	src: 'src',
	dist: 'dist',
	port: 3033
};

const prod = argv.prod || false;

function clean() {
	return del(config.dist);
}

function compileHtml () {
	return gulp.src([config.src + '/**/*.html', '!' + config.src + '/**/_*.html'])
		.pipe(plumber())
		.pipe(includePartials({
			prefix: '@@',
			basepath: '@file'
		}))
		.pipe(rename({dirname: ''}))
		.pipe(gulp.dest(config.dist));
}

function compileStyles() {
	let bundle = 'main.css';
	if (prod) bundle = 'main.min.css';

	return gulp.src([config.src + '/base/**/*.less', config.src + '/components/components.less', config.src + '/pages/**/*.less', '!' + config.src + '/**/_*.less'])
		.pipe(plumber())
		.pipe(gulpif(!prod, sourcemaps.init()))
		.pipe(less())
		.pipe(gulpif(!prod, sourcemaps.write('.')))
		.pipe(gulpif(prod, cssImport()))
		.pipe(gulpif(prod, cmq()))
		.pipe(gulpif(prod, prefix({
			overrideBrowsersList: ['last 10 versions'],
			cascade: false
		})))
		.pipe(concat(bundle))
		.pipe(gulpif(prod, cssmin()))
		.pipe(gulp.dest(config.dist + '/assets/css/'))
		.pipe(gulpif(!prod, browserSync.stream()));
}

function compileScripts() {
	let bundle = 'main.js';
	if (prod) bundle = 'main.min.js';
	return gulp.src([config.src + '/**/*.js', '!' + config.src + '/assets/**/*'])
		.pipe(plumber())
		.pipe(gulpif(!prod, sourcemaps.init()))
		.pipe(babel({
			presets: ['@babel/preset-env']
		}))
		.pipe(concat(bundle))
		.pipe(gulpif(!prod, sourcemaps.write('.')))
		.pipe(gulpif(prod, uglify()))
		.pipe(gulp.dest(config.dist + '/assets/js/'));
}

function copyAssets() {
	return gulp.src([config.src + '/assets/**/*'])
		.pipe(gulp.dest(config.dist + '/assets'));
}

const build = gulp.series([clean, gulp.parallel([compileHtml, compileStyles, compileScripts, copyAssets])]);

const serve = gulp.series([build, () => {
	browserSync.init({
		port: config.port,
		server: {
			baseDir: config.dist
		},
		open: false
	});

	gulp.watch(config.src + '/**/*.less', gulp.series(compileStyles));

	gulp.watch(config.src + '/**/*.js', gulp.series(compileScripts, done => {
		browserSync.reload();
		done();
	}));

	gulp.watch(config.src + '/**/*.html', gulp.series(compileHtml, done => {
		browserSync.reload();
		done();
	}));

	gulp.watch(config.src + '/assets/**/*', gulp.series(copyAssets, done => {
		browserSync.reload();
		done();
	}));
}]);


exports.serve = serve;
exports.build = build;