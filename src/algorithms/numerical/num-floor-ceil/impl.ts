// 向下/向上取整 · 实现
export function floor(x: number): number {
  const i = x >= 0 ? Math.trunc(x) : Number.isInteger(x) ? x : Math.trunc(x) - 1;
  return i;
}
export function ceil(x: number): number {
  const f = Math.floor(x);
  return f === x ? x : f + 1;
}
