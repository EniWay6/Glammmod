const { src, dest, watch, series, parallel } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');
const browserSync = require('browser-sync').create();

const paths = {
  html: {
    src: 'src/index.html',
    dest: 'dist/'
  },
  styles: {
    src: 'src/scss/main.scss',
    dest: 'dist/css/'
  }
};

const images = {
  src: 'src/img/**/*.{jpg,jpeg,png,gif,svg,webp}',
  dest: 'dist/img/'
};

function img() {
  return src(images.src)
    .pipe(dest(images.dest))
    .pipe(browserSync.stream());
}

function styles() {
  return src(paths.styles.src)
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCSS())
    .pipe(dest(paths.styles.dest))
    .pipe(browserSync.stream());
}

function html() {
  return src(paths.html.src)
    .pipe(dest(paths.html.dest))
    .pipe(browserSync.stream());
}

function serve() {
  browserSync.init({
    server: {
      baseDir: 'dist/'
    }
  });

  watch('src/scss/**/*.scss', styles);
  watch('src/*.html', html);
  watch('src/img/**/*.{jpg,jpeg,png,gif,svg,webp}', img); 
}

exports.styles = styles;
exports.html = html;
exports.img = img; 
exports.default = series(
  parallel(styles, html, img), 
  serve
);