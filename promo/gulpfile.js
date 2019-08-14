var gulp    = require('gulp'),
    sass    = require('gulp-sass'),
    less    = require('gulp-less'),
    runSequence = require('run-sequence'),
    sourcemaps  = require('gulp-sourcemaps'),
    tinypng     = require('gulp-tinypng');



// ------------------------------------------------- configs
var paths = {
  sass: {
    src: 'src/scss/**/*.scss'
  },
  less : {
    src : 'src/less/**/*.less'
  }
};

gulp.task('tinypng', function () {
    gulp.src('src/images/**/*.png')
        .pipe(tinypng('IdkEls3wmKQ2uJEJmjUnRvhN8gLCJZke'))
        .pipe(gulp.dest('src/images/compressed'));
});

gulp.task('less', function () {
    return gulp.src('src/less/**/*.less')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('src/css'));
});

// gulp.task('sass:watch', function () {
//     gulp.watch('src/scss/**/*.scss', ['sass']);
// });

gulp.task('less:watch', function () {
  gulp.watch(paths.less.src, gulp.series('less'));
});

gulp.task('autoprefixer', function () {
    var postcss      = require('gulp-postcss');
    var sourcemaps   = require('gulp-sourcemaps');
    var autoprefixer = require('autoprefixer');

    return gulp.src('src/css/*.css')
        .pipe(sourcemaps.init())
        .pipe(postcss([ autoprefixer() ]))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('src/css/autoprefixer/'));
});

gulp.task('dev', function (callback) {
    runSequence(
        'less',
        'less:watch'
    )
});

gulp.task('build', function (callback) {
    runSequence(
        'autoprefixer'
    )
});

gulp.task('default', gulp.series('less:watch', 
  // gulp.parallel('sass')
));
