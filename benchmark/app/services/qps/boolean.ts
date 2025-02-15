import { cached } from '@glimmer/tracking';

import { QP } from './base';

export class QPBoolean extends QP<boolean> {
  @cached
  get value() {
    let setValue = this.queryParams[this.name];

    if (typeof setValue === 'string') {
      return setValue === '1';
    }

    return this.defaultValue;
  }

  set = (item: boolean) => this.setQP({ [this.name]: item ? '1' : '0' });

  toggle = () => {
    if (this.value) {
      this.set(false);

      return;
    }

    this.set(true);
  };
}
