// McCarthy 91 · 实现
export interface MccarthyHooks {
  onRecurse?: (depth: number, n: number) => void;
  onBase?: (depth: number, value: number) => void;
  onReturn?: (depth: number, value: number) => void;
}
export interface MccarthyResult {
  result: number;
  depth: number;
  calls: number;
}
export function recMccarthy2(n: number, hooks: MccarthyHooks = {}): MccarthyResult {
  let calls = 0;
  let maxDepth = 0;
  const go = (k: number, depth: number): number => {
    calls++;
    maxDepth = Math.max(maxDepth, depth);
    hooks.onRecurse?.(depth, k);
    if (k > 100) {
      const v = k - 10;
      hooks.onBase?.(depth, v);
      return v;
    }
    const v = go(go(k + 11, depth + 1), depth + 1);
    hooks.onReturn?.(depth, v);
    return v;
  };
  const result = go(n, 0);
  return { result, depth: maxDepth, calls };
}
