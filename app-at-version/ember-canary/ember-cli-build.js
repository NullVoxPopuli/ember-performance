'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = async function (defaults) {
  const utils = await import('ember-cli-utils');
  const config = await utils.configure(__dirname, ['common']);

  const app = new EmberApp(defaults, {
    ...config,
    // Add options here
  });

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
    packagerOptions: {
      webpackConfig: {
        optimization: {
          minimize: true,
          minimizer: [
            new TerserPlugin({
              terserOptions: {
                module: true,
                compress: {
                  dead_code: true,
                  passes: 3,
                  keep_fargs: false,
                },
                format: {
                  comments: false,
                },
              },
            }),
          ],
        },
      },
    },
  });
};
