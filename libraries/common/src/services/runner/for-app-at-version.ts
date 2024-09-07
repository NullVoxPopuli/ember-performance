/* eslint-disable @typescript-eslint/no-explicit-any */
import Service from '@ember/service';
import { dependencySatisfies, importSync, macroCondition } from '@embroider/macros';

let getOwner: any = () => {
  throw new Error('Could not find getOwner');
};

if (macroCondition(dependencySatisfies('ember-source', '>= 4.11'))) {
  getOwner = (importSync('@ember/owner') as any).getOwner;
} else {
  getOwner = (importSync('@ember/application') as any).getOwner;
}

export default class ForAppAtVersion extends Service {
  get env() {
    let env = getOwner(this).resolveRegistration('config:environment');

    return env;
  }

  get emberVersion() {
    let name = this.env.deps.__name__;
    let cleaned = name.replace(/ember-/, '');

    return cleaned;
    // let versionSpecifier = this.env.deps['ember-source'];
    //
    // let cleaned = versionSpecifier.replace(/(\^|~|>=|<|>|<=)/, '');
    //
    // return cleaned;
  }
}
