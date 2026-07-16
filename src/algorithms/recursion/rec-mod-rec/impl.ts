// 递归取模 · 实现
export interface ModHooks {
  onRecurse?: (depth: number, a: number, b: number) => void;
  onBase?: (depth: number, value: number) => void;
  onReturn?: (depth: number, value: number) => void;
}
export interface ModResult {
  result: number;
  depth: number;
  calls: number;
}
export function recModRec(a: number, b: number, hooks: ModHooks = {}): ModResult {
  let calls = 0;
  let maxDepth = 0;
  const go = (x: number, y: number, depth: number): number => {
    calls++;
    maxDepth = Math.max(maxDepth, depth);
    hooks.onRecurse?.(depth, x, y);
    if (x < y) {
      hooks.onBase?.(depth, x);
      return x;
    }
    const v = go(x - y, y, depth + 1);
    hooks.onReturn?.(depth, v);
    return v;
  };
  const result = go(a, b, 0);
  return { result, depth: maxDepth, calls };
}
