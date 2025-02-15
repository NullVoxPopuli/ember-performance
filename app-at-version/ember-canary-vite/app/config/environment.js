const ENV = {
  modulePrefix: 'ember-canary-vite',
  environment: import.meta.env.DEV ? 'development' : 'production',
  rootURL: '/ember-canary-vite/',
  locationType: 'history',
  EmberENV: {
    EXTEND_PROTOTYPES: false,
    FEATURES: {
      // Here you can enable experimental features on an ember canary build
      // e.g. EMBER_NATIVE_DECORATOR_SUPPORT: true
    },
  },
  deps: {
    __name__: 'ember-canary-vite',
    'ember-source': 'v6.4.0-alpha.3#91467a6cd',
  },
  APP: {
    // Here you can pass flags/options to your application instance
    // when it is created
  },
};

export default ENV;

export function enterTestMode() {
  ENV.locationType = 'none';
  ENV.APP.rootElement = '#ember-testing';
  ENV.APP.autoboot = false;
}
