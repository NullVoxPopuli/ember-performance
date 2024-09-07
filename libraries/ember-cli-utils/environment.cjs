"use strict";

const path = require("path");

module.exports = {
  getDeps(dir /* config dir */) {
    let packageJson = path.join(dir, "../package.json");

    let manifest = require(packageJson);

    let { dependencies, devDependencies } = manifest;

    return {
      __name__: manifest.name,
      ...devDependencies,
      ...dependencies,
    };
  },
};
