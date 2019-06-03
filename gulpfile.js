const gulp = require('gulp');
const less = require('gulp-less');
const concat = require('gulp-concat');
const minifyCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const gulpinclude = require('gulp-file-include');
const browserSync = require('browser-sync').create();
var browserSyncReuseTab = require('browser-sync-reuse-tab')(browserSync)

//server
gulp.task('browser-sync', function() {
  browserSync.init({
    port: 3009,
    server: {
      baseDir: './build'
    },
    open: false // do not automatically open browser
  }, browserSyncReuseTab);
  browserSync.watch( 'build', browserSync.reload() );
});

gulp.task('fileinclude', function() {
  return gulp.src('./src/*.html')
    .pipe(gulpinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest('./build/'));
});

gulp.task('lessPack', async function() {
  gulp.src(['./src/less/styles.less'])
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(concat('main.css'))
    .pipe(minifyCSS())
    .pipe(rename({suffix: ".min"}))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./build/css'))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('watch', function(cb) {
  gulp.watch('./src/less/**/*.less', gulp.series('lessPack') );
  gulp.watch('./src/less/*.less', gulp.series('lessPack') );
	gulp.watch('./src/**/*.html').on( 'change' ,gulp.series('fileinclude') );
	gulp.watch('./build/index.html').on('change', browserSync.reload);
});

gulp.task('default', gulp.series(
  gulp.series('fileinclude', 'lessPack'),
  gulp.parallel('watch', 'browser-sync'),
));
