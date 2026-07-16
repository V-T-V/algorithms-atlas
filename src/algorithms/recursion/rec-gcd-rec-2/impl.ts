// 递归最大公约数 · 实现
export interface GcdHooks {
  onRecurse?: (depth: number, a: number, b: number) => void;
  onBase?: (depth: number, value: number) => void;
  onReturn?: (depth: number, value: number) => void;
}
export interface GcdResult {
  result: number;
  depth: number;
  calls: number;
}
export function recGcdRec2(a: number, b: number, hooks: GcdHooks = {}): GcdResult {
  let calls = 0;
  let maxDepth = 0;
  const go = (x: number, y: number, depth: number): number => {
    calls++;
    maxDepth = Math.max(maxDepth, depth);
    hooks.onRecurse?.(depth, x, y);
    if (y === 0) {
      hooks.onBase?.(depth, x);
      return x;
    }
    const v = go(y, x % y, depth + 1);
    hooks.onReturn?.(depth, v);
    return v;
  };
  const result = go(a, b, 0);
  return { result, depth: maxDepth, calls };
}
