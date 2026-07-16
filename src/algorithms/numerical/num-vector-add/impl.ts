// 向量加减 · 实现
export function vAdd(a: number[], b: number[]): number[] {
  if (a.length !== b.length) throw new RangeError('长度不匹配');
  return a.map((v, i) => v + b[i]!);
}
export function vSub(a: number[], b: number[]): number[] {
  if (a.length !== b.length) throw new RangeError('长度不匹配');
  return a.map((v, i) => v - b[i]!);
}
