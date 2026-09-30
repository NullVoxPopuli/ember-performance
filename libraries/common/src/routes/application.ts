import Route from '@ember/routing/route';

import { service } from '../service.ts';

import type ForAppVersion from '../services/runner/for-app-at-version.ts';
import type RouterService from '@ember/routing/router-service';

export class ApplicationRoute extends Route {
  @service declare router: RouterService;
  @service('runner/for-app-at-version') declare forApp: ForAppVersion;

  queryParams = {
    run: { refreshModel: false },
    timePerTest: { refreshModel: false },
  };

  model() {
    window.addEventListener('message', (e) => {
      if (typeof e.data !== 'string') return;

      let parsed;

      try {
        parsed = JSON.parse(e.data);
      } catch {
        return;
      }

      if (!Array.isArray(parsed)) return;

      let [command, arg] = parsed;

      if (command === 'run') {
        console.info(`Preparing bench ${arg} for version ${this.forApp.emberVersion}`);
        this.router.transitionTo('bench', arg);
      }
    });
  }
}
