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
2. `npx ember-cli@6.3 new ember-6-3 --no-welcome --pnpm --skip-install --skip-git --embroider`
3. Add dependencies 
    ```bash
    pnpm add --save-dev ember-eslint \
        common@workspace:^ ember-cli-utils@workspace:^ \
        pnpm-sync-dependencies-meta-injected \
        ember-route-template  
    ```

    It's important that these remain devdependencies, because we'll be adding the new 
    app as a `dependencies` entry in `benchmark/package.json` later.

4. Remove dependencies 
    ```bash 
    pnpm remove ember-data ember-fetch ember-cli-clean-css \
        stylelint stylelint-config-standard stylelint-prettier
    ```
5. Add to `config/environment.js`
    ```js
    const envUtils = require('ember-cli-utils/environment');

    // ...
    const ENV = {
      deps: envUtils.getDeps(__dirname),
      rootURL: '/ember-6-0/',
    }
    ```
6. Add to `ember-cli-build.js`    
    ```js
    module.exports = async function (defaults) {
      const utils = await import('ember-cli-utils');
      const config = await utils.configure(__dirname, ['common']);

      const app = new EmberApp(defaults, {
        ...config,
        // Add options here
      });
    ```
7. Add to `app/router.js` (or `app/router.ts`)
    ```js
    Router.map(function () {
      this.route('bench', { path: ':name' });
    });
    ```
8. Add a file, `app/routes/application.js` with contents:
    ```js 
    export { ApplicationRoute as default } from 'common';
    ```

9. Change the build scripts `package.json`. Delete `build` and add:
    ```
    "build:prod": "pnpm _syncPnpm && ember build --environment=production",
    "build:dev":  "pnpm _syncPnpm && ember build --environment=development",
    "_syncPnpm": "pnpm sync-dependencies-meta-injected",
    ```

10. Add a dependenciesMeta entry to your new project:
    ```
    "dependenciesMeta": {
      "common": {
        "injected": true
      }
    }
    ```
11. Add the new app as a `dependencies` entry in `benchmark/package.json`
    ```
    "ember-6-0": "workspace:*"
    ```
