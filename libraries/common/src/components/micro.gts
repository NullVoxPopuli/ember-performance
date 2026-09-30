import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import { use } from 'ember-resources';

import { service } from '../service.ts';
import { OneOffTinyBench, type Options } from './bench.ts';
import { Layout } from './layout.gts';
import { store } from './storage.ts';
import { onRenderIsh } from './utils.ts';

import type ForAppVersion from '../services/runner/for-app-at-version.ts';

export class MicroBenchmark extends Component<{
  Args: {
    name: string;
  } & Options;
}> {
  @service('runner/for-app-at-version') declare forApp: ForAppVersion;

  @tracked status = '';
  @tracked remaining = '';
  @tracked progress = '';

  @use bench = OneOffTinyBench(() => ({
    options: this.args,
    updateStatus: (msg: string) => (this.status = msg),
  }));

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

    requestIdleCallback(async () => {
      await bench.warmup();

      this.status = 'Running...';
      requestIdleCallback(async () => {
        await bench.run();

        store(this.args.name, version, altName, bench.results[0]);

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
      <:scratch></:scratch>
    </Layout>
  </template>
}
