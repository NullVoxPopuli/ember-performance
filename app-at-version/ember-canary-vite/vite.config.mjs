import { defineConfig } from 'vite';
import { extensions, ember } from '@embroider/vite';
import { babel } from '@rollup/plugin-babel';

const validator = `${process.cwd()}/node_modules/ember-source/dist/packages/@glimmer/validator/index.js`;
const tracking = `${process.cwd()}/node_modules/ember-source/dist/packages/@glimmer/tracking/index.js`;
const cachePrimitives = `${process.cwd()}/node_modules/ember-source/dist/packages/@glimmer/tracking/primitives/cache.js`;

export default defineConfig({
  base: '/ember-canary-vite/',
  resolve: {
    extensions,
    alias: [
      { find: /^@glimmer\/validator$/, replacement: validator },
      { find: /^@glimmer\/tracking$/, replacement: tracking },
      {
        find: /^@glimmer\/tracking\/primitives\/cache$/,
        replacement: cachePrimitives,
      },
    ],
  },
  plugins: [
    ember(),
    babel({
      babelHelpers: 'runtime',
      extensions,
    }),
  ],
});
