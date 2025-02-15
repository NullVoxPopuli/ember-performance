import { isDestroyed, isDestroying } from '@ember/destroyable';
import { service } from '@ember/service';

import type { QPs } from './types';
import type RouterService from '@ember/routing/router-service';

let frame: number;
let preQps: QPs;

export class QP<Value = unknown> {
  @service declare router: RouterService;

  protected name: string;
  protected defaultValue?: Value;

  constructor(name: string, defaultValue?: Value) {
    this.name = name;
    this.defaultValue = defaultValue;
  }

  get queryParams(): QPs {
    return (this.router.currentRoute?.queryParams ?? {}) as QPs;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  set = (..._args: any[]): void => {
    throw new Error('Not Implemented');
  };

  /**
   * Allows batching QP updates
   */
  protected setQP = (qps: QPs) => {
    if (frame) cancelAnimationFrame(frame);

    preQps = {
      ...this.queryParams,
      ...preQps,
      ...qps,
    };

    frame = requestAnimationFrame(() => {
      if (isDestroyed(this) || isDestroying(this)) return;

      this.router.transitionTo({
        queryParams: preQps,
      });
    });
  };
}
