// 向量数乘 · 实现
export function vScale(a: number[], k: number): number[] {
  return a.map((v) => v * k);
}
export function vNormalize(a: number[]): number[] {
  const n = Math.sqrt(a.reduce((s, v) => s + v * v, 0));
  if (n === 0) return a.slice();
  return a.map((v) => v / n);
}
