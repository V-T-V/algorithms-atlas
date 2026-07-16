// 递归斯特林数（第二类）· 实现
export interface SterlingHooks {
  onRecurse?: (depth: number, n: number, k: number) => void;
  onBase?: (depth: number, value: number) => void;
  onReturn?: (depth: number, value: number) => void;
}
export interface SterlingResult {
  result: number;
  depth: number;
  calls: number;
}
export function recSterlingRec(n: number, k: number, hooks: SterlingHooks = {}): SterlingResult {
  let calls = 0;
  let maxDepth = 0;
  const go = (a: number, b: number, depth: number): number => {
    calls++;
    maxDepth = Math.max(maxDepth, depth);
    hooks.onRecurse?.(depth, a, b);
    if (a === 0 && b === 0) {
      hooks.onBase?.(depth, 1);
      return 1;
    }
    if (a === 0 || b === 0) {
      hooks.onBase?.(depth, 0);
      return 0;
    }
    if (b > a) {
      hooks.onBase?.(depth, 0);
      return 0;
    }
    const v = b * go(a - 1, b, depth + 1) + go(a - 1, b - 1, depth + 1);
    hooks.onReturn?.(depth, v);
    return v;
  };
  const result = go(n, k, 0);
  return { result, depth: maxDepth, calls };
}
