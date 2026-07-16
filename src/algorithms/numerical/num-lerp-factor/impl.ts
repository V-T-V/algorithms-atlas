// 插值因子 · 实现
export function invLerp(a: number, b: number, x: number): number {
  if (a === b) return 0;
  return (x - a) / (b - a);
}
