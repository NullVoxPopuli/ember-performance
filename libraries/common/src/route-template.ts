import { dependencySatisfies, macroCondition } from '@embroider/macros';

import RouteTemplate from 'ember-route-template';

/**
 * ember-source 6.3 accepts a component as a route template.
 *
 * Older versions need the ember-route-template wrapper.
 */
export const Route: typeof RouteTemplate = macroCondition(
  dependencySatisfies('ember-source', '>= 6.3.0')
)
  ? (((component: unknown) => component) as typeof RouteTemplate)
  : RouteTemplate;
