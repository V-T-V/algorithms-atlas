// 向量点积 · 实现
export function dot(a: number[], b: number[]): number {
  if (a.length !== b.length) throw new RangeError('长度不匹配');
  let s = 0;
  for (let i = 0; i < a.length; i++) s += a[i]! * b[i]!;
  return s;
}
