// 5 元中位数 · 实现（6 次比较）
export interface M5Hooks {
  onCompare?: (a: number, b: number) => void;
  onResult?: (m: number) => void;
}
function sort2(a: number, b: number): [number, number] {
  return a <= b ? [a, b] : [b, a];
}
export function medianOf5(arr: number[], hooks: M5Hooks = {}): number {
  const [a, b, c, d, e] = arr;
  if (a === undefined || b === undefined || c === undefined || d === undefined || e === undefined)
    throw new Error('need 5');
  const [x1, x2] = sort2(a, b);
  hooks.onCompare?.(a, b);
  const [x3, x4] = sort2(c, d);
  hooks.onCompare?.(c, d);
  const [y1, y2] = sort2(x1, x3);
  hooks.onCompare?.(x1, x3);
  const [y3, y4] = sort2(x2, x4);
  hooks.onCompare?.(x2, x4);
  // 现在 y1 是 4 个里最小之一；丢弃 y1（不可能是中位数候选之上的最低）
  // 比较 e 与 y2,y3,y4 求中位数
  const arr2 = [e, y2, y3, y4];
  arr2.sort((p, q) => p - q);
  const m = arr2[1]!;
  void y1;
  hooks.onResult?.(m);
  return m;
}
