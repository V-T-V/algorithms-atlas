// 分发饼干 · 实现
export interface AssignHooks {
  onMatch?: (childIdx: number, cookieIdx: number) => void;
  onConclude?: (count: number) => void;
}
export interface AssignResult {
  count: number;
}
export function greedyAssign2(
  g: readonly number[],
  s: readonly number[],
  hooks: AssignHooks = {},
): AssignResult {
  const gs = [...g].sort((a, b) => a - b);
  const ss = [...s].sort((a, b) => a - b);
  let i = 0;
  let j = 0;
  let count = 0;
  while (i < gs.length && j < ss.length) {
    if (ss[j]! >= gs[i]!) {
      hooks.onMatch?.(i, j);
      count++;
      i++;
    }
    j++;
  }
  hooks.onConclude?.(count);
  return { count };
}
