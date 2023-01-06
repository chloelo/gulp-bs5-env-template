// const gulp = require('gulp');
// const concat = require('gulp-concat');
const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const $ = require('gulp-load-plugins')({ lazy: false });

function buildStyles() {
  return src('./src/scss/**/*.scss')
    .pipe(sass())
    .pipe(dest('./dist/css'));
}

// 自動監聽，只要有儲存檔案就會自動將sass編譯成css
function watchTasks() {
  watch(['./src/**/*.ejs', './src/**/*.html'] ,series(layoutHTML));
  watch(['sass/**/*.scss'], buildStyles);
}

function layoutHTML(){
  return src(['./src/**/*.ejs', './src/**/*.html'])
  .pipe($.plumber())
  .pipe($.frontMatter())
  .pipe(
    $.layout((file) => {
      return file.frontMatter;
    }),
  )
  .pipe(dest('./dist'))
}

function vendorsJs() {
  return src(envOptions.vendors.src)
    .pipe($.concat(envOptions.vendors.concat))
    .pipe(dest(envOptions.vendors.path));
}
exports.default = series(layoutHTML, buildStyles, watchTasks);