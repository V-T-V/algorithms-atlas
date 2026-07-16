// 极差 · 实现
export function range(values: number[]): number {
  if (values.length === 0) throw new RangeError('空数组');
  return Math.max(...values) - Math.min(...values);
}
