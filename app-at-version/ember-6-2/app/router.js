import EmberRouter from '@ember/routing/router';
import config from 'ember-6-2/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('bench', { path: ':name' });
});
