// 绝对值 · 实现
export function abs(x: number): number {
  return x < 0 ? -x : x;
}
export function sign(x: number): number {
  return x > 0 ? 1 : x < 0 ? -1 : 0;
}
