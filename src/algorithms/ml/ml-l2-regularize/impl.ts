// L2 正则化项 · 实现
export function l2Regularization(w: number[], lambda = 1): number {
  let s = 0;
  for (const v of w) s += v * v;
  return 0.5 * lambda * s;
}
