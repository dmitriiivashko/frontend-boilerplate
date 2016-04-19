import runSequence from 'run-sequence';

export default function (gulp) {
  gulp.task('build', (done) => {
    runSequence(
      'jekyll-build',
      [
        'images',
        'fonts',
        'scss-minified',
        'js-production',
      ],
      done
    );
  });

  gulp.task('watch', (done) => {
    runSequence(
      [
        'scss-watch',
        'images-watch',
        'fonts-watch',
        'js-watch',
      ],
      'jekyll-async',
      [
        'connect',
        'jekyll-watch',
      ],
      done
    );
  });

  gulp.task('clean', ['jekyll-clean']);

  return ['build', 'watch', 'clean'];
}
