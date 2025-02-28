import Application from '@ember/application';
import Resolver from 'ember-resolver';
import config from './config/environment';

import { registry } from './registry.js';

export default class App extends Application {
  modulePrefix = config.modulePrefix;
  podModulePrefix = config.podModulePrefix;
  Resolver = Resolver.withModules(registry);
}
