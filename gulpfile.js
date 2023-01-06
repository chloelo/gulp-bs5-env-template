// const gulp = require('gulp');
// const concat = require('gulp-concat');
const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));

// gulp.task('concat', function () {
//   return gulp
//     .src('./src/*.js') //輸入資料來源路徑
//     .pipe(concat('all.js')) //輸出檔案名稱
//     .pipe(gulp.dest('./dist/')); //輸出檔案路徑
// });

function buildStyles() {
  return src('./src/scss/**/*.scss')
    .pipe(sass())
    .pipe(dest('./dist/css'));
}

// 自動監聽，只要有儲存檔案就會自動將sass編譯成css
function watchTasks() {
  watch(['sass/**/*.scss'], buildStyles);
}

exports.default = series(buildStyles, watchTasks);