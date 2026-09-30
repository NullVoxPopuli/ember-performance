### Ember Performance Suite


[Development](https://ember-performance-testing-dev.pages.dev/) | [Production](https://ember-performance-testing-prod.pages.dev/)

-------------

The Ember Performance Suite is designed to help profile and diagnose
the performance of the Ember.js framework. The general strategy is:

- Browsers have a large variance in performance characteristics, so
  run each test in a new document, storing the results in localStorage.


### To run in development mode

1. `pnpm install`
2. `pnpm start`
3. `Open http://localhost:4200`

### License

MIT

### Adding a new app

1. `cd app-at-version`
2. `npx ember-cli@7.3 new ember-7-3 --no-welcome --no-ember-data --pnpm --skip-install --skip-git`
3. `cd ember-7-3`
4. Delete the lint and format files.
    ```bash
    rm -rf .github README.md .watchmanconfig eslint.config.mjs \
        .prettierignore .prettierrc.mjs .stylelintignore .stylelintrc.mjs .template-lintrc.mjs
    ```
5. Remove the lint and format dependencies.
    ```bash
    pnpm remove @babel/eslint-parser @eslint/js eslint eslint-config-prettier \
        eslint-plugin-ember eslint-plugin-n eslint-plugin-qunit globals \
        prettier prettier-plugin-ember-template-tag \
        stylelint stylelint-config-standard ember-template-lint
    ```
6. Add the shared dependencies.
    ```bash
    pnpm add --save-dev \
        common@workspace:^ ember-cli-utils@workspace:^ \
        pnpm-sync-dependencies-meta-injected \
        ember-route-template
    ```

    These must stay `devDependencies`.
    The new app becomes a `dependencies` entry in `benchmark/package.json` in the last step.

7. Add to `config/environment.js`
    ```js
    const envUtils = require('ember-cli-utils/environment');

    // ...
    const ENV = {
      deps: envUtils.getDeps(__dirname),
      rootURL: '/ember-7-3/',
    }
    ```
8. Add to `vite.config.mjs`
    ```js
    export default defineConfig({
      base: '/ember-7-3/',
      // ...
    });
    ```
9. Add to `app/router.js`
    ```js
    Router.map(function () {
      this.route('bench', { path: ':name' });
    });
    ```
10. Add a file, `app/routes/application.js`, with this content:
    ```js
    export { ApplicationRoute as default } from 'common';
    ```
11. Delete `app/templates/application.gjs`.
    The application template comes from `common`.
12. Replace the `scripts` in `package.json` with:
    ```json
    "build:prod": "pnpm _syncPnpm && vite build",
    "build:dev": "pnpm _syncPnpm && vite build --mode development",
    "start": "pnpm _syncPnpm && NODE_NO_WARNINGS=1 concurrently 'vite' 'pnpm _syncPnpm --watch' --names 'serve,inject'",
    "_syncPnpm": "pnpm sync-dependencies-meta-injected"
    ```
13. Add a `dependenciesMeta` entry to `package.json`:
    ```json
    "dependenciesMeta": {
      "common": {
        "injected": true
      }
    }
    ```
14. Add the new app as a `dependencies` entry in `benchmark/package.json`
    ```json
    "ember-7-3": "workspace:*"
    ```

For Ember 6.7 and older, the blueprint does not use Vite:

- Add `--embroider` to the `ember-cli new` command in step 2.
- Skip steps 8 and 11.
- In step 12, use `ember build --environment=production` and `ember build --environment=development`.
- Spread the shared build config into the app options in `ember-cli-build.js`:
    ```js
    module.exports = async function (defaults) {
      const utils = await import('ember-cli-utils');
      const config = await utils.configure(__dirname, ['common']);

      const app = new EmberApp(defaults, {
        ...config,
      });
    ```

### Updating canary

1. Get the current canary version and tarball path.
    ```bash
    curl -s https://s3.amazonaws.com/builds.emberjs.com/canary.json
    ```
2. In `app-at-version/ember-canary`, delete the old `ember-source-*.tgz`.
3. Download the tarball to `ember-source-<version>.tgz`.
    ```bash
    curl -o 'ember-source-<version>.tgz' 'https://s3.amazonaws.com/builds.emberjs.com<assetPath>'
    ```
4. Set `ember-source` in `package.json` to `file:ember-source-<version>.tgz`.
5. `pnpm install`
