import EmberRouter from '@embroider/router';
import config from 'ember-6-11/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('bench', { path: ':name' });
});
