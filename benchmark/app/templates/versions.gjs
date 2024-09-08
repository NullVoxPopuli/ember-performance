import RouteTemplate from 'ember-route-template';

import { ExternalLink } from './components/external-link';
import { sortedEmbers } from './utils';

export default RouteTemplate(
  <template>
    <p>These are links to direct-interact with each of the ember versions this project tests
      with/against. By navigating directly to an app, you'll be able to run browser perf inspecting
      tools.</p>

    <nav>
      <ul>
        {{#each sortedEmbers as |x|}}
          <li>
            <ExternalLink href={{x.url}}>
              {{x.short}}
            </ExternalLink>
          </li>
        {{/each}}
      </ul>
    </nav>
  </template>
);
