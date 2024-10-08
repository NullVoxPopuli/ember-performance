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
  return str.includes('canary') || str.includes('beta') || str.includes('alpha');
}

function prereleaseValue(v: string) {
  return v.includes('canary') ? 3 : v.includes('alpha') ? 2 : v.includes('beta') ? 1 : 0;
}

function comparePrerelease(a: string, b: string) {
  let aValue = prereleaseValue(a);
  let bValue = prereleaseValue(b);

  if (aValue === bValue) return 0;

  return aValue > bValue ? 1 : -1;
}

export function looseSemverCompare(a: string, b: string) {
  let isASpecial = isCanaryOrBeta(a);
  let isBSpecial = isCanaryOrBeta(b);

  if (isASpecial && isBSpecial) {
    return comparePrerelease(a, b);
  }

  if (isASpecial) {
    return 1;
  }

  if (isBSpecial) {
    return -1;
  }

  let aV = a.replaceAll('-', '.').match(/\d+\.\d+(\.\d+)?/);
  let bV = b.replaceAll('-', '.').match(/\d+\.\d+(\.\d+)?/);

  if (!aV || !aV[0]) return -1;
  if (!bV || !bV[0]) return 1;

  let aVFull = aV[0].split('.').length === 2 ? `${aV[0]}.0` : aV[0];
  let bVFull = bV[0].split('.').length === 2 ? `${bV[0]}.0` : bV[0];

  return semverCompare(aVFull, bVFull);
}
