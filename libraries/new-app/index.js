import { $ } from 'execa';
import { packageJson } from 'ember-apply';
import assert from 'node:assert';

let [_, _, version, ...args] = process.argv;

assert(version, `Requires a version`);

let apps = 'apps-at-version';
let name = `ember-${version.replace('.', '-')}`;
let emberCli = `ember-cli@${version}`;

await $({
  cwd: apps,
})`npx ${emberCli} new ${name} --typescript --pnpm --skip-install --skip-git --skip-npm --embroider`;

await packageJson.addDevDendencies({
  '@nullvoxpopuli/eslint-configs': '4.2.0',
  common: 'workspace:^',
  'ember-cli-utils': 'workspace:^',
  'ember-template-imports': '^4.0.0',
  'prettier-plugin-ember-template-tag': '2.0.2',
  'ember-route-template': '1.0.3',
});

await packageJson.removeDevDependencies([
  // ... too many
]);
