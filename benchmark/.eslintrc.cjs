'use strict';

const { configs } = require('@nullvoxpopuli/eslint-configs');

// accommodates: JS, TS, App, Addon, and V2 Addon
const config = configs.ember();

module.exports = {
  ...config,
  overrides: [
    ...config.overrides,
    {
      files: ['**/*.{js,ts,gjs,gts}'],
      rules: {
        // lint is bugged
        'ember/classic-decorator-no-classic-methods': 'off',
      },
    },
  ],
};
