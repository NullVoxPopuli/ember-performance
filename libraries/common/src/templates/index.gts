// @ts-expect-error types-missing
import { LinkTo } from '@ember/routing';

import { Version } from '../components/version.gts';
import { Route } from '../route-template.ts';
import { scenarios } from '../scenarios.ts';

export default Route(
  <template>
    <h1>Run a benchmark</h1>
    <em>Using <Version /></em>

    <nav>
      <ul>
        {{#each-in scenarios as |name|}}
          <li><LinkTo @route="bench" @model={{name}}>{{name}}</LinkTo></li>
        {{/each-in}}
      </ul>
    </nav>
  </template>
);
