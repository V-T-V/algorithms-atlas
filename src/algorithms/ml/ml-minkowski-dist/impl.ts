// 明可夫斯基距离 · 实现
export function minkowskiDistance(a: number[], b: number[], p: number): number {
  if (a.length !== b.length) throw new RangeError('长度不匹配');
  if (p === Infinity) {
    let m = 0;
    for (let i = 0; i < a.length; i++) m = Math.max(m, Math.abs(a[i]! - b[i]!));
    return m;
  }
  let s = 0;
  for (let i = 0; i < a.length; i++) s += Math.abs(a[i]! - b[i]!) ** p;
  return s ** (1 / p);
}
