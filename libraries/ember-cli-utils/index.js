import path from 'node:path';
import fs from 'node:fs';
import { readPackageUpSync } from 'read-package-up';
import sideWatch from '@embroider/broccoli-side-watch';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const isCI = Boolean(process.env.CI);

export async function configure(__dirname, deps) {
  const { readPackageUpSync } = await import('read-package-up');

  return {
    'ember-cli-babel': {
      enableTypeScriptTransform: true,
    },
    ...(isCI
      ? {}
      : {
          autoImport: {
            watchedDependencies: [...deps],
          },
          trees: {
            app: (() => {
              let paths = [...deps].map((libraryName) => {
                let entry = require.resolve(libraryName, {
                  paths: [__dirname],
                });
                let { packageJson, path: packageJsonPath } = readPackageUpSync({
                  cwd: entry,
                });
                let packagePath = path.dirname(packageJsonPath);

                console.debug(
                  `Side-watching ${libraryName} from ${packagePath}, which started in ${entry}`,
                );

                let toWatch = packageJson.files
                  .map((f) => path.join(packagePath, f))
                  .filter((p) => {
                    if (!fs.existsSync(p)) return false;
                    if (!fs.lstatSync(p).isDirectory()) return false;

                    return !p.endsWith('/src');
                  });

                return toWatch;
              });

              console.debug('All side-watched paths:', paths.flat());

              return sideWatch('app', { watching: paths.flat() });
            })(),
          },
        }),
  };
}
