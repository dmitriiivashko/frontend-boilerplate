import yargs from 'yargs';
import _ from 'lodash';
import path from 'path';
import touch from 'touch';
import fs from 'fs';
import mkdirp from 'mkdirp';

export default function (gulp, settings) {
  gulp.task('g:component', () => {
    const name = _.trim(yargs.argv.name, ' /');
    if (name === '') {
      return;
    }

    const pathComponents = name.split('/');
    const filename = pathComponents.pop();
    const namespace = pathComponents.shift();

    const namespaceFilePath = path.resolve(__dirname, '..', settings.build.paths.source.scss, 'components', `_${namespace}.scss`);
    const mainCssPath = path.resolve(__dirname, '..', settings.build.paths.source.scss, 'main.scss');

    if (namespace) {
      mkdirp.sync(path.resolve(__dirname, '..', settings.build.paths.source.scss, 'components', namespace, pathComponents.join('/')));
      mkdirp.sync(path.resolve(__dirname, '..', settings.main.source, settings.main.includes_dir, 'components', namespace, pathComponents.join('/')));
      touch.sync(namespaceFilePath);
      touch.sync(path.resolve(__dirname, '..', settings.build.paths.source.scss, 'components', namespace, pathComponents.join('/'), `_${filename}.scss`));
      touch.sync(path.resolve(__dirname, '..', settings.main.source, settings.main.includes_dir, 'components', namespace, pathComponents.join('/'), `${filename}.html`));
    } else {
      touch.sync(path.resolve(__dirname, '..', settings.build.paths.source.scss, 'components', pathComponents.join('/'), `_${filename}.scss`));
      touch.sync(path.resolve(__dirname, '..', settings.main.source, settings.main.includes_dir, 'components', pathComponents.join('/'), `${filename}.html`));
    }

    const mainContent = fs.readFileSync(mainCssPath, 'utf8');

    if (namespace) {
      const namespaceContent = fs.readFileSync(namespaceFilePath, 'utf8');
      if (namespaceContent.indexOf(`"${path.join(namespace, pathComponents.join('/'), filename)}"`) === -1) {
        fs.appendFileSync(namespaceFilePath, `@import "${path.join(namespace, pathComponents.join('/'), filename)}";\n`, 'utf8');
      }
      if (mainContent.indexOf(`"components/${namespace}"`) === -1) {
        fs.appendFileSync(mainCssPath, `@import "components/${namespace}";\n`, 'utf8');
      }
    } else {
      if (mainContent.indexOf(`"components/${name}"`) === -1) {
        fs.appendFileSync(mainCssPath, `@import "components/${name}";\n`, 'utf8');
      }
    }
  });

  return ['g:component'];
}
