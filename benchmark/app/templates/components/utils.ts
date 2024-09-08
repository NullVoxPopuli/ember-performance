const currentLocale = Intl.NumberFormat().resolvedOptions().locale;

export function formatNumber(
  number: number,
  hash?: { mode: string } & Parameters<typeof Intl.NumberFormat>[1]
) {
  const { mode } = hash ?? { mode: 'auto' };

  if (mode !== 'auto') {
    return Intl.NumberFormat(currentLocale, hash).format(number);
  }

  const [, exponent] = Number(number)
    .toExponential()
    .split('e')
    .map((item) => Number(item));

  if (exponent && exponent >= 0) {
    return Intl.NumberFormat(currentLocale, {
      minimumFractionDigits: 3,
    }).format(number);
  }

  return Intl.NumberFormat(currentLocale, {
    minimumFractionDigits: Math.abs(exponent || 0) + 2,
  }).format(number);
}

export function getAltName(altName: string) {
  if (altName.match(/\d+-\d+$/)) return '';

  return ` (${altName})`;
}
