import Application from '@ember/application';

import config from 'ember-5-10-local-glimmer/config/environment';
import loadInitializers from 'ember-load-initializers';
import Resolver from 'ember-resolver';

export default class App extends Application {
  modulePrefix = config.modulePrefix;
  podModulePrefix = config.podModulePrefix;
  Resolver = Resolver;
}

loadInitializers(App, config.modulePrefix);
