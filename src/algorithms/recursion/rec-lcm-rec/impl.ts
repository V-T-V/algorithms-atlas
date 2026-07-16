// 递归最小公倍数 · 实现
export interface LcmHooks {
  onGcd?: (depth: number, a: number, b: number) => void;
  onReturn?: (value: number) => void;
}
export interface LcmResult {
  result: number;
  depth: number;
  calls: number;
}
export function recLcmRec(a: number, b: number, hooks: LcmHooks = {}): LcmResult {
  let calls = 0;
  let maxDepth = 0;
  const gcd = (x: number, y: number, depth: number): number => {
    calls++;
    maxDepth = Math.max(maxDepth, depth);
    hooks.onGcd?.(depth, x, y);
    if (y === 0) return x;
    return gcd(y, x % y, depth + 1);
  };
  const g = gcd(a, b, 0);
  const result = (a / g) * b;
  hooks.onReturn?.(result);
  return { result, depth: maxDepth, calls };
}
