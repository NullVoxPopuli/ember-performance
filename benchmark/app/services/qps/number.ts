import { cached } from '@glimmer/tracking';

import { QP } from './base';

export class QPInteger extends QP<number> {
  @cached
  get value() {
    let setValue = this.queryParams[this.name];

    if (typeof setValue === 'string') {
      return parseInt(setValue);
    }

    return this.defaultValue;
  }

  set = (item: number | string) => this.setQP({ [this.name]: item });
}
