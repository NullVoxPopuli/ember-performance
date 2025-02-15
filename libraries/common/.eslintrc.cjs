'use strict';

const { configs } = require('@nullvoxpopuli/eslint-configs');

// accommodates: JS, TS, App, Addon, and V2 Addon
const config = configs.ember();

module.exports = {
  ...config,
  overrides: [
    ...config.overrides,
    {
      files: ['**/*.gjs', '**/*.gts'],
      rules: {
        'ember/no-runloop': 'off',
      },
    },
  ],
};
