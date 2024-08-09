'use strict';

const semverCompare = require('semver/functions/compare-loose');
const envUtils = require('ember-cli-utils/environment');
const fs = require('fs');

function isCanaryOrBeta(str) {
  return str.includes('-canary') || str.includes('-beta');
}

function emberVersions() {
  return fs
    .readdirSync('../app-at-version')
    .map(function (file) {
      if (file.includes('-canary')) {
        return 'ember-canary';
      }

      if (file.includes('-beta')) {
        return 'ember-beta';
      }

      let matchResult = file.match(/\d+-\d+/);

      if (!matchResult) return;

      let version = matchResult[0];

      return version.replace('-', '.');
    })
    .filter(Boolean)
    .sort((a, b) => {
      let isASpecial = isCanaryOrBeta(a);
      let isBSpecial = isCanaryOrBeta(b);

      if (isASpecial && isBSpecial) {
        return a.localeCompare(b);
      }

      if (isASpecial) {
        return 1;
      }

      if (isBSpecial) {
        return 1;
      }


    return semverCompare(`${a}.0`, `${b}.0`)
    });
}



let localEmbers = emberVersions();

module.exports = function (environment) {
  const ENV = {
    LOCAL_EMBER_VERSIONS: localEmbers,
    modulePrefix: 'ember-performance',
    environment,
    rootURL: '/',
    locationType: 'history',
    EmberENV: {
      EXTEND_PROTOTYPES: false,
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. EMBER_NATIVE_DECORATOR_SUPPORT: true
      },
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },

    deps: envUtils.getDeps(__dirname),
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
  }

  if (environment === 'production') {
    // here you can enable a production-specific feature
  }

  return ENV;
};
