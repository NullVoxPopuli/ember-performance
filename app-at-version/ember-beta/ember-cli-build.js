'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = async function (defaults) {
  const utils = await import('ember-cli-utils');
  const config = await utils.configure(__dirname, ['common']);

  const app = new EmberApp(defaults, {
    ...config,
    // Add options here
  });

  if (process.env.BUILD === 'classic') {
    return app.toTree();
  }

  const { Webpack } = require('@embroider/webpack');
  return require('@embroider/compat').compatBuild(app, Webpack, {
    staticAddonTestSupportTrees: true,
    staticAddonTrees: true,
    staticHelpers: true,
    staticModifiers: true,
    staticComponents: true,
    staticEmberSource: true,
    skipBabel: [
      {
        package: 'qunit',
      },
    ],
  });
};
