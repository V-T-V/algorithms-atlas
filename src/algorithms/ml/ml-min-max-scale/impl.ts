// Min-Max 归一化 · 实现
export function minMaxScale(values: number[], lo = 0, hi = 1): number[] {
  const mn = Math.min(...values),
    mx = Math.max(...values);
  if (mn === mx) return values.map(() => (lo + hi) / 2);
  return values.map((v) => lo + ((v - mn) / (mx - mn)) * (hi - lo));
}
