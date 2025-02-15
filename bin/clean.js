import { getPackages } from '@manypkg/get-packages';
import { packageJson } from 'ember-apply';
import { rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { globby } from 'globby';

const repo = await getPackages(process.cwd());


const depsToRemove = [
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
    'prettier',
    'prettier-plugin-ember-template-tag',
    'globals',
];
/**
 * Removing all these from each project will help overall
 * install times.
 *
 * We don't touch these projects after they're set up, so linting is
 * not all that important.
 */
for (let pkg of repo.packages) {
  if (!pkg.dir.includes('app-at-version')) continue;

  await packageJson.modify((json => {
    let hasVite = Boolean(json.devDependencies['vite'])

    // no styles, also I don't like stylelint
    delete json.scripts['lint:css'];
    delete json.scripts['lint:css:fix'];
    // no hbs
    delete json.scripts['lint:hbs'];
    delete json.scripts['lint:hbs:fix'];
    // lint from root
    delete json.scripts['lint'];
    delete json.scripts['lint:fix'];
    delete json.scripts['lint:js'];
    delete json.scripts['lint:js:fix'];

    // Don't want the regular build
    // as we use build:dev and build:prod
    delete json.scripts.build;

    // scripts we want
    if (!hasVite) {
    json.scripts['start'] =
     "pnpm _syncPnpm && NODE_NO_WARNINGS=1 concurrently 'ember serve' 'pnpm _syncPnpm --watch' --names 'serve,inject'";
    }

    for (let dep of depsToRemove) {
      delete json.devDependencies[dep];
    }

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
    join(pkg.dir, '.github'),
  ];

  for (let f of toRemove) {
    if (existsSync(f)) {
      await rm(f, { recursive: true });
    }
  }

}

const nokeeps = await globby(['**/.gitkeep'], { gitignore: true} );

for (let f of nokeeps) {
  await rm(f, { recursive: true });
}
