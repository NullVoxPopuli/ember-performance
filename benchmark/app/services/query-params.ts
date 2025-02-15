import Service from '@ember/service';

import { link } from 'reactiveweb/link';

import { QPArray } from './qps/array';
import { QPBoolean } from './qps/boolean';
import { QPInteger } from './qps/number';

/**
 * A light QP service.
 * Contsraints:
 * - every QP is defined at the application-level
 * - all QPs are sticky
 * - setting QPs cannot happen synchronously, because setting QPs
 *   requires a transition.
 *   (also true of the default way to use QPs, but they hide it)
 */
export default class QueryParams extends Service {
  @link emberVersions = new QPArray('emberVersions');
  @link benchmarks = new QPArray('benchmarks');
  @link clear = new QPBoolean('clear');
  @link randomize = new QPBoolean('randomize', true);
  @link timePerTest = new QPInteger('timePerTest', 1_000);
}
