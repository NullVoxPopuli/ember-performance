import { Addon } from "@embroider/addon-dev/rollup";

import { babel } from "@rollup/plugin-babel";

const addon = new Addon({
  srcDir: "src",
  destDir: "dist",
});

export default {
  output: addon.output(),

  plugins: [
    addon.publicEntrypoints(["index.js", "templates/*.js", "routes/*.js", "services/**/*.js"]),
    addon.appReexports(["templates/*.js", "services/**/*.js"]),
    addon.dependencies(),
    babel({
      extensions: [".js", ".ts", ".gjs", ".gts"],
      babelHelpers: "bundled",
    }),
    addon.gjs(),
    addon.keepAssets(["**/*.css"]),
    addon.clean(),
  ],
};
