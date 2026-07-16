// 分位数 · 实现

function percentile(sorted: number[], p: number): number {
  if (sorted.length === 0) throw new Error('数据为空');
  if (sorted.length === 1) return sorted[0]!;
  const rank = (p / 100) * (sorted.length - 1);
  const lo = Math.floor(rank);
  const hi = Math.ceil(rank);
  const frac = rank - lo;
  return sorted[lo]! + frac * (sorted[hi]! - sorted[lo]!);
}

/** 把数据分成 q 份，返回 q-1 个切点。 */
export function quantile(data: readonly number[], q: number): number[] {
  if (q < 2) throw new RangeError(`q=${q} 必须 >= 2`);
  const sorted = [...data].sort((a, b) => a - b);
  const cuts: number[] = [];
  for (let i = 1; i < q; i++) {
    cuts.push(percentile(sorted, (i / q) * 100));
  }
  return cuts;
}
