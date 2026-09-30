import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
// Isn't exposed until Ember v5 something
// import { renderSettled } from '@ember/renderer';
import { renderSettled } from '@ember/-internals/glimmer';
import { assert } from '@ember/debug';

import { use } from 'ember-resources';

import { service } from '../service.ts';
import { OneOffTinyBench, type Options } from './bench.ts';
import { Layout } from './layout.gts';
import { store } from './storage.ts';
import { onRenderIsh } from './utils.ts';

import type ForAppVersion from '../services/runner/for-app-at-version.ts';

/**
 * renderSettled doesn't exist in earlier versions of ember.
 */
// async function renderSettled() {
//   await new Promise((resolve) => schedule('afterRender', resolve));
//   await Promise.resolve();
// }

export class RenderBenchmark extends Component<{
  Args: {
    name: string;
  } & Omit<Options, 'test'>;
  Blocks: {
    default: [];
  };
}> {
  @service('runner/for-app-at-version') declare forApp: ForAppVersion;

  @tracked status = '';
  @tracked remaining = '';
  @tracked progress = '';
  @tracked showContents = false;

  #continue?: (x?: unknown) => void;

  @use bench = OneOffTinyBench(() => {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let renderComponent = this;

    return {
      options: {
        ...this.args,
        setup: async () => {
          if ('gc' in globalThis) {
            // eslint-disable-next-line no-undef
            gc();
          }
        },
        beforeEach: async () => {
          renderComponent.showContents = false;

          await renderSettled();
          await new Promise((resolve) => requestAnimationFrame(resolve));
        },
        test: async () => {
          assert(
            `showContents must be false. It was: ${renderComponent.showContents}`,
            false === renderComponent.showContents
          );
          renderComponent.showContents = true;

          await renderSettled();
        },
      },
      updateStatus: (msg: string) => (this.status = msg),
    };
  });

  isRunning = false;
  run = async () => {
    if (this.isRunning) {
      console.info('Already running');

      return;
    }

    this.isRunning = true;

    let bench = this.bench;
    let version = this.forApp.emberVersion;
    let altName = this.forApp.name;

    this.status = 'Warming up...';

    this.showContents = false;

    requestAnimationFrame(async () => {
      await bench.warmup();

      this.status = 'Running...';
      requestAnimationFrame(async () => {
        await bench.run();

        let result = bench.results[0];

        if (result?.error) {
          throw result.error;
        }

        store(this.args.name, version, altName, result);

        window.top.postMessage('finish');
      });
    });
  };

  <template>
    {{onRenderIsh this.run}}

    <Layout @name={{@name}} @version={{this.forApp.emberVersion}}>
      <:remaining>{{this.remaining}}</:remaining>
      <:status>{{this.status}}</:status>
      <:progress>{{this.progress}}</:progress>
      <:scratch>
        {{#if this.showContents}}
          {{yield}}
        {{/if}}
      </:scratch>
    </Layout>
  </template>
}
