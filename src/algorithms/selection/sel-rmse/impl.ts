// 均方根误差 · 实现
export interface RmseHooks {
  onMean?: (m: number) => void;
  onResult?: (rmse: number) => void;
}
export function rmse(arr: number[], hooks: RmseHooks = {}): number {
  if (arr.length === 0) return NaN;
  const mu = arr.reduce((s, x) => s + x, 0) / arr.length;
  hooks.onMean?.(mu);
  const v = Math.sqrt(arr.reduce((s, x) => s + (x - mu) ** 2, 0) / arr.length);
  hooks.onResult?.(v);
  return v;
}
