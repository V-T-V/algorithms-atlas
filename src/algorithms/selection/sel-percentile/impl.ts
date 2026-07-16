// 百分位数 · 实现

/** 返回第 p 百分位（p∈[0,100]），NumPy linear 方法。不改原数组。 */
export function percentile(data: readonly number[], p: number): number {
  if (data.length === 0) throw new Error('数据为空');
  if (p < 0 || p > 100) throw new RangeError(`p=${p} 越界 [0,100]`);
  const sorted = [...data].sort((a, b) => a - b);
  if (sorted.length === 1) return sorted[0]!;
  const rank = (p / 100) * (sorted.length - 1);
  const lo = Math.floor(rank);
  const hi = Math.ceil(rank);
  const frac = rank - lo;
  return sorted[lo]! + frac * (sorted[hi]! - sorted[lo]!);
}

/** 一次返回多个百分位。 */
export function percentiles(data: readonly number[], ps: number[]): number[] {
  return ps.map((p) => percentile(data, p));
}
