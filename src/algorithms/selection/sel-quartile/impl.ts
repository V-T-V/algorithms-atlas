// 四分位数 · 实现

function percentile(data: number[], p: number): number {
  if (data.length === 0) throw new Error('数据为空');
  if (data.length === 1) return data[0]!;
  const rank = (p / 100) * (data.length - 1);
  const lo = Math.floor(rank);
  const hi = Math.ceil(rank);
  const frac = rank - lo;
  return data[lo]! + frac * (data[hi]! - data[lo]!);
}

export interface Quartiles {
  q1: number;
  q2: number;
  q3: number;
}

export function quartiles(data: readonly number[]): Quartiles {
  const sorted = [...data].sort((a, b) => a - b);
  return {
    q1: percentile(sorted, 25),
    q2: percentile(sorted, 50),
    q3: percentile(sorted, 75),
  };
}
