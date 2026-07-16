// 四分位距 IQR · 实现

import { quartiles } from '../sel-quartile/impl.ts';

export interface IqrResult {
  q1: number;
  q3: number;
  iqr: number;
  lowerFence: number; // Q1 - 1.5*IQR
  upperFence: number; // Q3 + 1.5*IQR
  outliers: number[];
}

export function iqr(data: readonly number[]): IqrResult {
  const q = quartiles(data);
  const iqrVal = q.q3 - q.q1;
  const lowerFence = q.q1 - 1.5 * iqrVal;
  const upperFence = q.q3 + 1.5 * iqrVal;
  const outliers = data.filter((v) => v < lowerFence || v > upperFence);
  return { q1: q.q1, q3: q.q3, iqr: iqrVal, lowerFence, upperFence, outliers };
}
