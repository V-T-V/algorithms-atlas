// 中位数 · 实现
export function median(values: number[]): number {
  if (values.length === 0) throw new RangeError('空数组');
  const s = [...values].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 === 1 ? s[mid]! : (s[mid - 1]! + s[mid]!) / 2;
}
