// L1 正则化项 · 实现
export function l1Regularization(w: number[], lambda = 1): number {
  let s = 0;
  for (const v of w) s += Math.abs(v);
  return lambda * s;
}
