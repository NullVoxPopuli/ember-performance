import { setApplication } from '@ember/test-helpers';
import * as QUnit from 'qunit';
import { setup } from 'qunit-dom';
import { start } from 'ember-qunit';

import Application from 'ember-performance/app';
import config from 'ember-performance/config/environment';

setApplication(Application.create(config.APP));

setup(QUnit.assert);

start();
