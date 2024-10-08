export const noop = () => {};

export const MACRO_MAX_TIME = 15000;
export const MACRO_MIN_TIME = 2000;
export const MACRO_STOP_RME = 3.0;
export const MIN_SAMPLES = 5;

/**
 * T-Distribution two-tailed critical values for 95% confidence
 * http://www.itl.nist.gov/div898/handbook/eda/section3/eda3672.htm
 */
export const tTable = {
  1: 12.706,
  2: 4.303,
  3: 3.182,
  4: 2.776,
  5: 2.571,
  6: 2.447,
  7: 2.365,
  8: 2.306,
  9: 2.262,
  10: 2.228,
  11: 2.201,
  12: 2.179,
  13: 2.16,
  14: 2.145,
  15: 2.131,
  16: 2.12,
  17: 2.11,
  18: 2.101,
  19: 2.093,
  20: 2.086,
  21: 2.08,
  22: 2.074,
  23: 2.069,
  24: 2.064,
  25: 2.06,
  26: 2.056,
  27: 2.052,
  28: 2.048,
  29: 2.045,
  30: 2.042,
  infinity: 1.96,
};
