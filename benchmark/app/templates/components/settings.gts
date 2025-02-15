import Component from '@glimmer/component';
import { assert } from '@ember/debug';
import { on } from '@ember/modifier';
import { service } from '@ember/service';

import type { BenchSession } from 'common';
import type QueryParams from 'ember-performance/services/query-params';

export class Settings extends Component {
  @service declare queryParams: QueryParams;
  @service declare benchSession: BenchSession;

  toggleClear = () => {
    this.queryParams.clear.toggle();
  };

  toggleRandom = () => {
    this.queryParams.randomize.toggle();
  };

  setTimePerTest = (event: Event) => {
    assert(`[Bug]`, event.target instanceof HTMLInputElement);
    this.queryParams.timePerTest.set(event.target.value);
  };

  <template>
    <fieldset>
      <legend>Settings</legend>

      <div class="form-group">
        <div>
          <label>

            <input
              type="checkbox"
              checked={{this.queryParams.clear.value}}
              {{on "change" this.toggleClear}}
            />

            Clear prior results
          </label>
        </div>

        <div>
          <label>

            <input
              type="checkbox"
              checked={{this.queryParams.randomize.value}}
              {{on "change" this.toggleRandom}}
            />

            Randomize
          </label>
        </div>

        <br />
        <div>
          <label>
            Test Duration (ms)
            <br />
            <input
              type="number"
              value={{this.queryParams.timePerTest.value}}
              {{on "input" this.setTimePerTest}}
            />
          </label>
        </div>
      </div>
    </fieldset>
  </template>
}
