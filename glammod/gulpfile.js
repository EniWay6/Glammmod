const { src, dest, watch, series, parallel } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const browserSync = require('browser-sync').create();

// Шляхи до файлів
const paths = {
  html: {
    src: 'src/*.html',
    dest: 'dist/'
  },
  styles: {
    src: 'src/scss/main.scss',
    dest: 'dist/css/'
  }
};

// Функція для роботи з HTML
function html() {
  return src(paths.html.src)
    .pipe(dest(paths.html.dest));
}

// Функція для роботи зі стилями
function styles() {
  return src(paths.styles.src)
    .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError)) // Красивий формат (НЕ мінімізований)
    .pipe(dest(paths.styles.dest))
    .pipe(browserSync.stream()); // Автооновлення стилів
}

// Сервер + слідкування за файлами
function serve() {
  browserSync.init({
    server: {
      baseDir: ['dist', 'src'] // <<< Головне! Доступ і до dist, і до src (для картинок)
    }
  });

  watch('src/scss/**/*.scss', series(styles));
  watch('src/*.html', series(html));
  watch('dist/*.html').on('change', browserSync.reload);
}

// Експортуємо задачі
exports.html = html;
exports.styles = styles;
exports.serve = serve;

// Основна задача за замовчуванням
exports.default = series(
  parallel(html, styles),
  serve
);
