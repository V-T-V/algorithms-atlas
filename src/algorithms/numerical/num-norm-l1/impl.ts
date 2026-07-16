// L1 范数 · 实现
export function l1Norm(x: number[]): number {
  return x.reduce((s, v) => s + Math.abs(v), 0);
}
export function l2Norm(x: number[]): number {
  return Math.sqrt(x.reduce((s, v) => s + v * v, 0));
}
export function linfNorm(x: number[]): number {
  return Math.max(...x.map(Math.abs));
}
