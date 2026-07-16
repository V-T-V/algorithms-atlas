// 中位数填充缺失值 · 实现
export function medianImpute(values: (number | null)[]): number[] {
  const valid = values.filter((v): v is number => v !== null).sort((a, b) => a - b);
  if (valid.length === 0) return values.map(() => 0);
  const med =
    valid.length % 2 === 1
      ? valid[(valid.length - 1) / 2]!
      : (valid[valid.length / 2 - 1]! + valid[valid.length / 2]!) / 2;
  return values.map((v) => (v === null ? med : v));
}
