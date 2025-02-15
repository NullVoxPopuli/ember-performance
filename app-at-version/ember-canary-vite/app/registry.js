
import Router from './router.js';
import PageTitleService from 'ember-page-title/services/page-title';
import { BenchSession } from 'common';
import { default as ForAppAtVersion } from 'common/services/runner/for-app-at-version';

const appName = `ember-canary-vite`;

function formatAsResolverEntries(imports) {
  return Object.fromEntries(
    Object.entries(imports).map(([k, v]) => [
      k.replace(/\.g?(j|t)s$/, '').replace(/^\.\//, `${appName}/`),
      v,
    ])
  );
}

/**
 * A global registry is needed until:
 * - Services can be referenced via import paths (rather than strings)
 * - we design a new routing system
 */
const resolverRegistry = {
  ...formatAsResolverEntries(
    import.meta.glob('./templates/**/*.{gjs,gts,js,ts}', { eager: true })
  ),
  ...formatAsResolverEntries(
    import.meta.glob('./services/**/*.{js,ts}', { eager: true })
  ),
  ...formatAsResolverEntries(
    import.meta.glob('./routes/**/*.{js,ts}', { eager: true })
  ),
  [`${appName}/router`]: Router,
};

export const registry = {
  ...resolverRegistry,
  [`${appName}/services/page-title`]: PageTitleService,
  [`${appName}/services/bench-session`]: BenchSession,
  [`${appName}/services/runner/for-app-at-version`]: ForAppAtVersion,
};
