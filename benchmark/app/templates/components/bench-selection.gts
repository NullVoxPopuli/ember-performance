import Component from '@glimmer/component';
import { fn } from '@ember/helper';
import { on } from '@ember/modifier';
import { service } from '@ember/service';

import type { BenchSession } from 'common';
import type QueryParams from 'ember-performance/services/query-params';

const { Array } = globalThis;

class Item extends Component<{ Args: { name: string } }> {
  @service declare queryParams: QueryParams;

  toggle = (name: string) => {
    this.queryParams.benchmarks.toggle(name);
  };

  <template>
    <div>
      <label>

        <input
          type="checkbox"
          checked={{this.queryParams.benchmarks.hasItem @name}}
          {{on "change" (fn this.toggle @name)}}
        />

        {{@name}}
      </label>
    </div>
  </template>
}

export class BenchSelection extends Component {
  @service declare queryParams: QueryParams;
  @service declare benchSession: BenchSession;

  selectAll = () => {
    this.queryParams.benchmarks.set(this.benchSession.availableBenchmarks);
  };

  selectNone = () => {
    this.queryParams.benchmarks.set([]);
  };

  hasAnyActive = (maybeGroup: typeof this.benchSession.groupedBenchmarks) => {
    if (Array.isArray(maybeGroup)) {
      return maybeGroup.some((esModule) => this.queryParams.benchmarks.hasItem(esModule.name));
    }

    return Object.values(maybeGroup)
      .flat()
      .some((esModule) => this.queryParams.benchmarks.hasItem(esModule.name));
  };

  <template>
    <style>
      .benchmark-list {
        padding-left: 0.5rem;

        ul {
          padding-left: 1rem;
        }

        li {
          list-style: none;
        }
        span {
          font-size: 1.5rem;
          line-height: 2rem;
          cursor: pointer;
          border-bottom: 1px solid;
        }

        span + li {
          margin-left: 0.5rem;
        }
      }
    </style>
    <fieldset>
      <legend>Benchmarks</legend>

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

      <ul class="benchmark-list form-group">
        {{#each-in this.benchSession.groupedBenchmarks as |groupName group|}}
          <li>
            <span>{{groupName}}</span>
            {{#if (Array.isArray group)}}
              {{#each group as |esModule|}}
                <Item @name={{esModule.name}} />
              {{/each}}
            {{else}}
              <ul>
                {{#each-in group as |subGroup group|}}
                  <li>
                    <span>{{subGroup}}</span>
                    {{#each group as |esModule|}}
                      <Item @name={{esModule.name}} />
                    {{/each}}
                  </li>
                {{/each-in}}

              </ul>
            {{/if}}
          </li>
        {{/each-in}}
      </ul>
    </fieldset>
  </template>
}
