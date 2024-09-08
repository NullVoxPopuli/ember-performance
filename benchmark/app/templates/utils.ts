import ENV from 'ember-performance/config/environment';
import semverCompare from 'semver/functions/compare-loose';

const { LOCAL_EMBER_VERSIONS } = ENV;

interface EmberInfo {
  url: string;
  short: string;
  name: string;
}
/**
 * TODO: these are no longer versions, but the app folder name
 */
export const sortedEmbers = LOCAL_EMBER_VERSIONS.map((name: string) => {
  return {
    url: versionToUrl(name),
    short: toShortName(name),
    name,
  };
}).toSorted((a: EmberInfo, b: EmberInfo) => looseSemverCompare(a.short, b.short));

export function versionToUrl(version: string) {
  let name = version;

  return `${location.protocol}//${location.host}/${name}/`;
}

export function toShortName(version: string) {
  let noPrefix = version.replace('ember-', '');

  if (noPrefix.match(/\d+-\d+/)) {
    return noPrefix.replace('-', '.');
  }

  return noPrefix;
}

function isCanaryOrBeta(str: string) {
  return str.includes('canary') || str.includes('beta');
}

function looseSemverCompare(a: string, b: string) {
  let isASpecial = isCanaryOrBeta(a);
  let isBSpecial = isCanaryOrBeta(b);

  if (isASpecial && isBSpecial) {
    return a.localeCompare(b);
  }

  if (isASpecial) {
    return -1;
  }

  if (isBSpecial) {
    return -1;
  }

  let aV = a.replaceAll('-', '.').match(/\d+\.\d+/);
  let bV = b.replaceAll('-', '.').match(/\d+\.\d+/);

  if (!aV || !aV[0]) return -1;
  if (!bV || !bV[0]) return 1;

  return semverCompare(`${aV[0]}.0`, `${bV[0]}.0`);
}
