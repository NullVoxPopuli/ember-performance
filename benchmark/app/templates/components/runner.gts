import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { assert } from '@ember/debug';
import { on } from '@ember/modifier';
import { service } from '@ember/service';

import { clearAll } from 'common';

import type RouterService from '@ember/routing/router-service';
import type { BenchSession } from 'common';
import type QueryParams from 'ember-performance/services/query-params';

// https://stackoverflow.com/a/12646864
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [array[i], array[j]] = [array[j], array[i]];
  }
}

export class Runner extends Component {
  @service declare router: RouterService;
  @service declare queryParams: QueryParams;
  @service declare benchSession: BenchSession;

  @tracked testUrl = '';
  @tracked isRunning = false;
  @tracked totalTests = 0;
  @tracked remainingTests = 0;
  @tracked status = '';

  waiter?: (value?: unknown) => void;
  currentIframeWindow?: Window | null;
  emitReady = (event: Event) => {
    assert(`event.target cannot be null`, event.target);
    assert(`event.target must be an iframe element`, event.target instanceof HTMLIFrameElement);

    let win = event.target.contentWindow;

    this.currentIframeWindow = win;
    assert(`Cannot resume when there is no waiter`, this.waiter);

    this.waiter();
  };

  /**
   * This is gross, I'm sorry
   */
  start = async () => {
    try {
      await Promise.resolve();
      this.isRunning = true;

      if (this.queryParams.clear.value) {
        this.queryParams.clear.toggle();
        clearAll();
      }

      let isRandom = this.queryParams.randomize.value;
      let remainingVersions = [...this.queryParams.emberVersions.value];
      let remainingTests = [...this.queryParams.benchmarks.value];

      this.totalTests = remainingVersions.length * remainingTests.length;
      this.remainingTests = this.totalTests;

      if (isRandom) {
        shuffleArray(remainingVersions);
      }

      while (remainingVersions.length) {
        let current = remainingVersions.pop();

        let testsForVersion = [...remainingTests];

        if (isRandom) {
          shuffleArray(testsForVersion);
        }

        while (testsForVersion.length) {
          let bench = testsForVersion.pop();

          let waitForIFrameLoad = new Promise((resolve) => (this.waiter = resolve));

          let { protocol, host } = window.location;

          let subPath = `${current.replace(`.`, `-`)}`;
          let timePerTest = this.queryParams.timePerTest.value;

          this.testUrl = `${protocol}//${host}/${subPath}/index.html?run=${bench}&timePerTest=${timePerTest}`;

          await waitForIFrameLoad;

          assert(`Could not determine iframe for test`, this.currentIframeWindow);

          let finish: (v?: unknown) => void;
          let finishPromise = new Promise((resolve) => (finish = resolve));

          // eslint-disable-next-line
          const waitForFinish = async (event: MessageEvent) => {
            if (event.data === 'finish') {
              window.removeEventListener('message', waitForFinish);
              // Removes the IFrame
              this.testUrl = '';

              this.remainingTests--;
              // This is an arbitrary timeout of 1s to try to give the Garbage Collector some time to catch up.
              // The goal is to reduce the variance in the tests.
              this.status = 'Letting GC catch up...';
              await new Promise((resolve) => setTimeout(resolve, 1000));
              this.status = '';
              finish();
            }
          };

          window.addEventListener('message', waitForFinish);
          this.currentIframeWindow.postMessage(JSON.stringify(['run', bench]));

          await finishPromise;
        }
      }
    } finally {
      this.isRunning = false;
      this.router.transitionTo('report');
    }
  };
  get canStart() {
    return !this.isRunning;
  }

  get cannotStart() {
    return !this.canStart;
  }

  <template>
    <div class="footer">
      <button
        type="button"
        class="btn btn-primary"
        {{on "click" this.start}}
        disabled={{this.cannotStart}}
      >Run Tests</button>

      {{#if this.isRunning}}
        Running
        {{this.totalTests}}
        Tests.
        {{this.remainingTests}}
        Remaining...
        {{this.status}}
      {{/if}}
    </div>

    {{#if this.testUrl}}
      <iframe
        title="Current Test"
        src={{this.testUrl}}
        style="width: 300px; min-height: 400px; position: fixed; right: 0.5rem; bottom: 0.5rem; border: 1px solid; border-radius: 0.5rem; background: white;"
        {{on "load" this.emitReady}}
      ></iframe>
    {{/if}}
  </template>
}
