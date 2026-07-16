// 众数 · 实现
export function mode(values: number[]): number[] {
  if (values.length === 0) return [];
  const cnt: Record<number, number> = {};
  for (const v of values) cnt[v] = (cnt[v] ?? 0) + 1;
  let max = 0;
  for (const k in cnt) if (cnt[k]! > max) max = cnt[k]!;
  return Object.keys(cnt)
    .filter((k) => cnt[Number(k)] === max)
    .map(Number)
    .sort((a, b) => a - b);
}
