const { src, dest, watch, series, parallel } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');
const browserSync = require('browser-sync').create();

// Шляхи
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

// Компіляція SCSS → CSS
function styles() {
  return src(paths.styles.src)
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCSS())
    .pipe(dest(paths.styles.dest))
    .pipe(browserSync.stream());
}

// Копіювання HTML
function html() {
  return src(paths.html.src)
    .pipe(dest(paths.html.dest))
    .pipe(browserSync.stream());
}

// Локальний сервер
function serve() {
  browserSync.init({
    server: {
      baseDir: 'dist/'
    }
  });

  watch('src/scss/**/*.scss', styles);
  watch('src/*.html', html);
}

// Експорт тасків
exports.styles = styles;
exports.html = html;
exports.default = series(
  parallel(styles, html),
  serve
);
