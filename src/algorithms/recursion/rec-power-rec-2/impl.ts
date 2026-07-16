// 递归幂 · 实现
export interface PowerHooks {
  onRecurse?: (depth: number, a: number, b: number) => void;
  onBase?: (depth: number) => void;
  onReturn?: (depth: number, value: number) => void;
}
export interface PowerResult {
  result: number;
  depth: number;
  calls: number;
}
export function recPowerRec2(a: number, b: number, hooks: PowerHooks = {}): PowerResult {
  let calls = 0;
  let maxDepth = 0;
  const go = (x: number, y: number, depth: number): number => {
    calls++;
    maxDepth = Math.max(maxDepth, depth);
    hooks.onRecurse?.(depth, x, y);
    if (y === 0) {
      hooks.onBase?.(depth);
      return 1;
    }
    const v = x * go(x, y - 1, depth + 1);
    hooks.onReturn?.(depth, v);
    return v;
  };
  const result = go(a, b, 0);
  return { result, depth: maxDepth, calls };
}
