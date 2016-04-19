import path from 'path';
import plumber from 'gulp-plumber';
import sass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import cleanCss from 'gulp-clean-css';
import watch from 'gulp-watch';

export default function (gulp, settings) {
  const cssSourcePath = path.resolve(__dirname, '..', settings.build.paths.source.scss, '**/*.scss');
  const cssDestPath = path.resolve(__dirname, '..', settings.main.destination, settings.build.paths.destination.scss);

  const buildScss = function (minify) {
    if (!settings.build.features.scss.enabled) {
      return Promise.resolve(null);
    }

    let chain = gulp.src(cssSourcePath).pipe(plumber({ errorHandler: (err) => {
      handleErrors('SCSS', err);
    } })).pipe(sass());

    if (!minify) {
      chain = chain.pipe(sourcemaps.init());
    }

    if (settings.build.features.scss.autoprefix.enabled) {
      chain = chain.pipe(postcss([autoprefixer(settings.build.features.scss.autoprefix.settings)]));
    }

    if (!minify) {
      chain = chain.pipe(sourcemaps.write());
    }

    if (minify && settings.build.features.scss.minify) {
      chain = chain.pipe(cleanCss());
    }

    chain = chain.pipe(gulp.dest(cssDestPath));

    return new Promise((resolve) => {
      chain.on('end', resolve);
    });
  };

  gulp.task('scss', () => buildScss(false));

  gulp.task('scss-minified', () => buildScss(true));

  gulp.task('scss-watch', () => {
    watch(cssSourcePath, () => {
      buildScss(false);
    });
    return buildScss(false);
  });

  return null;
}
