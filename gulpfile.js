var gulp = require('gulp');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var rename = require('gulp-rename');
var cssnano = require('cssnano');
var stylelint = require('stylelint');
var reporter = require('postcss-reporter');
var cssvariables = require('postcss-css-variables');
var calc = require("postcss-calc");
var cssmixins = require('postcss-mixins');
var eachloop = require('postcss-each');
var nested = require('postcss-nested');
var simpleVars = require('postcss-simple-vars');

gulp.task('style', ['lint'], function () {
  return gulp.src('src/*.css')
    .pipe(postcss(
      [
        autoprefixer,
        cssvariables(/*options*/),
        cssmixins(/*options*/),
        calc(/*options*/),
        eachloop(/*options*/),
        nested(/*options*/),
        simpleVars()
      ]
    ))
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.write('map/'))
    .pipe(gulp.dest('dist/'));
});

gulp.task('rename', ['style'], function () {
  return gulp.src('dist/style.css')
    .pipe(postcss([cssnano]))
    .pipe(rename('style.min.css'))
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.write('map/'))
    .pipe(gulp.dest('dist/'));
});

gulp.task('lint', function () {
  return gulp.src('src/*.css')
    .pipe(postcss([
      stylelint({
        "rules": {
          "color-no-invalid-hex": true,
          "declaration-colon-space-before": "never",
          "indentation": 2,
          "number-leading-zero": "never"
        }
      }),
      reporter({
        clearAllMessages: true,
      })
    ]))
});

gulp.task('default', ['lint', 'style', 'rename']);

var watcher = gulp.watch('src/*.css', ['default']);

watcher.on('change', function (e) {
  console.log('File ' + e.path + ' was ' + e.type + ', running tasks...');
})
