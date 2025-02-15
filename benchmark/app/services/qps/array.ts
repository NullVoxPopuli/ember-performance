import { cached } from '@glimmer/tracking';

import { QP } from './base';

export class QPArray extends QP {
  @cached
  get value() {
    return decodeJSONArrayURI(this.queryParams[this.name]);
  }

  set = (item: string[]) => this.setQP({ [this.name]: JSON.stringify(item) });

  hasItem = (item: string) => this.value.includes(item);

  remove = (item: string) => {
    if (this.hasItem(item)) {
      let without = this.value.filter((v: string) => v !== item);

      this.set(without);
    }
  };

  add = (item: string) => {
    if (this.hasItem(item)) return;

    let added = [...this.value, item];

    this.set(added);
  };

  toggle = (item: string) => {
    if (this.hasItem(item)) {
      this.remove(item);

      return;
    }

    this.add(item);
  };
}

function decodeJSONArrayURI(raw?: unknown) {
  if (!raw) return [];
  if (typeof raw !== 'string') return [];

  let decoded = decodeURIComponent(raw);

  try {
    let parsed = JSON.parse(decoded);

    return parsed;
  } catch (e) {
    console.error(e);

    return [];
  }
}
