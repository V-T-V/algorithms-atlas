// 区间夹紧 · 实现
export function clamp(x: number, lo: number, hi: number): number {
  if (lo > hi) throw new RangeError('lo 不能大于 hi');
  return Math.max(lo, Math.min(hi, x));
}
