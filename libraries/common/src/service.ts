import { dependencySatisfies, importSync, macroCondition } from '@embroider/macros';

import type * as EmberService from '@ember/service';

/**
 * `service` was added in ember-source 4.1.
 *
 * `inject` was removed in ember-source 7.0.
 */
export const service: typeof EmberService.service = macroCondition(
  dependencySatisfies('ember-source', '>= 4.1.0')
)
  ? (importSync('@ember/service') as typeof EmberService).service
  : // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (importSync('@ember/service') as any).inject;
