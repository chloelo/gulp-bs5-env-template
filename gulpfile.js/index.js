// const gulp = require('gulp');
const { src, dest, watch, series, parallel } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const $ = require('gulp-load-plugins')({ lazy: false });
const autoprefixer = require('autoprefixer');
// const minimist = require('minimist');
const browserSync = require('browser-sync').create();
const { envOptions } = require('./envOptions');

// let options = minimist(process.argv.slice(2), envOptions);
// //現在開發狀態
// console.log(`Current mode：${options.env}`);

function copyFile() {
  return src(envOptions.copyFile.src)
  .pipe(dest(envOptions.copyFile.path))
  .pipe(
    browserSync.reload({
      stream: true,
    }),
  );
}

function layoutHTML() {
  return src(envOptions.html.src)
    .pipe($.plumber())
    .pipe($.frontMatter())
    .pipe(
      $.layout((file) => {
        return file.frontMatter;
      })
    )
    .pipe(dest(envOptions.html.path))
    .pipe(
      browserSync.reload({
        stream: true,
      }),
    );
}
function buildStyles() {
  return src(envOptions.style.src)
    .pipe(sass({
      outputStyle: envOptions.style.outputStyle,
    }).on('error', sass.logError))
    .pipe($.postcss([autoprefixer(),]))
    .pipe(dest(envOptions.style.path))
    .pipe(
      browserSync.reload({
        stream: true,
      }),
    );
}

function babel() {
  return src(envOptions.javascript.src)
    // .pipe($.sourcemaps.init())
    .pipe($.babel({
      presets: ['@babel/env'],
    }))
    .pipe($.concat(envOptions.javascript.concat))
    // .pipe($.sourcemaps.write('.'))
    .pipe(dest(envOptions.javascript.path))
    .pipe(
      browserSync.reload({
        stream: true,
      }),
    );
}

function vendorsJs() {
  return src(envOptions.vendors.src)
    .pipe($.concat(envOptions.vendors.concat))
    .pipe(dest(envOptions.vendors.path));
}


function browser() {
  browserSync.init({
    server: {
      baseDir: envOptions.browserSetting.dir,
    },
    port: envOptions.browserSetting.port,
  });
}

function clean() {
  return src(envOptions.clean.src, {
      read: false,
      allowEmpty: true,
    })
    .pipe($.clean());
}

function deploy() {
  return src(envOptions.deploySrc)
    .pipe($.ghPages());
}

function watchTasks() {
  watch(envOptions.html.src, series(layoutHTML));
  watch(envOptions.html.ejsSrc, series(layoutHTML));
  watch(envOptions.javascript.src, series(babel));
  watch(envOptions.img.src, series(copyFile));
  watch(envOptions.style.src, series(buildStyles));
}

exports.deploy = deploy;

exports.clean = clean;

exports.build = series(clean, copyFile, layoutHTML, buildStyles, babel, vendorsJs);

// exports.bs = series(compileBootstrap);


exports.default = series(clean, copyFile, layoutHTML, buildStyles, babel, vendorsJs, parallel(browser, watchTasks));
