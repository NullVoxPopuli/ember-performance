import { getPackages } from '@manypkg/get-packages';
import { packageJson } from 'ember-apply';
import { rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const repo = await getPackages(process.cwd());

/**
 * Removing all these from each project will help overall
 * install times.
 *
 * We don't touch these projects after they're set up, so linting is
 * not all that important.
 */
for (let pkg of repo.packages) {
  if (!pkg.dir.includes('app-at-version')) continue;

  await packageJson.removeDependencies([
    '@nullvoxpopuli/eslint-configs',
    'eslint',
    'eslint-plugin-ember',
    'eslint-plugin-n',
    'eslint-plugin-prettier',
    'eslint-plugin-qunit',
    'eslint-config-prettier',
    '@babel/eslint-parser',
    'ember-template-lint',
    'typescript-eslint',
    'stylelint',
    'stylelint-config-standard',
    'globals',
  ], pkg.dir);
  await packageJson.modify((json => {
    // no styles, also I don't like stylelint
    delete json.scripts['lint:css'];
    delete json.scripts['lint:css:fix'];
    // no hbs
    delete json.scripts['lint:hbs'];
    delete json.scripts['lint:hbs:fix'];

    // Don't want the regular build
    // as we use build:dev and build:prod
    delete json.scripts.build;
  }), pkg.dir)

  const toRemove = [
    join(pkg.dir, 'stylelintrc.js'),
    join(pkg.dir, '.stylelintignore'),
    join(pkg.dir, '.eslintignore'),
    join(pkg.dir, '.eslintrc.cjs'),
    join(pkg.dir, '.eslintrc.js'),
    join(pkg.dir, 'eslint.config.js'),
    join(pkg.dir, 'eslint.config.mjs'),
    join(pkg.dir, '.prettierignore'),
    join(pkg.dir, '.prettierrc.cjs'),
    join(pkg.dir, '.prettierrc.js'),
    join(pkg.dir, '.template-lintrc.cjs'),
    join(pkg.dir, '.template-lintrc.js'),
    join(pkg.dir, '.template-lintrc.mjs'),
    join(pkg.dir, 'README.md'),
    join(pkg.dir, '.watchmanconfig'),
  ];

  for (let f of toRemove) {
    if (existsSync(f)) {
      await rm(f);
    }
  }
}
