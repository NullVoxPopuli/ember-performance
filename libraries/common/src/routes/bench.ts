import Route from '@ember/routing/route';

import { service } from '../service.ts';

import type RouterService from '@ember/routing/router-service';

export class BenchRoute extends Route {
  @service declare router: RouterService;

  // Placeholder
}
