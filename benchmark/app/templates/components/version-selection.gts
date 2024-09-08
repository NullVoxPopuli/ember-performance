import Component from '@glimmer/component';
import { fn } from '@ember/helper';
import { on } from '@ember/modifier';
import { service } from '@ember/service';

import { sortedEmbers } from '../utils';

import type { BenchSession } from 'common';
import type QueryParams from 'ember-performance/services/query-params';

export class VersionSelection extends Component {
  @service declare queryParams: QueryParams;
  @service declare benchSession: BenchSession;

  selectAll = () => {
    this.queryParams.emberVersions.set(this.benchSession.availableEmberVersions);
  };

  selectNone = () => {
    this.queryParams.emberVersions.set([]);
  };

  toggle = (version: string) => {
    this.queryParams.emberVersions.toggle(version);
  };

  <template>
    <fieldset>
      <legend>Versions</legend>
      <button
        {{on "click" this.selectAll}}
        type="button"
        class="btn btn-default btn-xs"
      >All</button>
      <button
        {{on "click" this.selectNone}}
        type="button"
        class="btn btn-default btn-xs"
      >None</button>

      <br /><br />

      <div class="form-group">
        {{#each sortedEmbers as |x|}}
          <div>
            <label>

              <input
                type="checkbox"
                checked={{this.queryParams.emberVersions.hasItem x.name}}
                {{on "change" (fn this.toggle x.name)}}
              />

              {{x.short}}
            </label>
          </div>
        {{/each}}
      </div>
    </fieldset>
  </template>
}
