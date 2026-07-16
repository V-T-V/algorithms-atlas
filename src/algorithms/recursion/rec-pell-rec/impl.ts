// rec-pell-rec · 实现
export interface RecHooks {
  onRecurse?: (depth: number, n: number) => void;
  onBase?: (depth: number, value: number) => void;
  onReturn?: (depth: number, n: number, value: number) => void;
}
export interface RecResult {
  result: number;
  depth: number;
  calls: number;
}
export function recPellRec(n: number, hooks: RecHooks = {}): RecResult {
  let calls = 0;
  let maxDepth = 0;
  const go = (k: number, depth: number): number => {
    calls++;
    maxDepth = Math.max(maxDepth, depth);
    hooks.onRecurse?.(depth, k);
    if (k === 0) {
      hooks.onBase?.(depth, 0);
      return 0;
    }
    if (k === 1) {
      hooks.onBase?.(depth, 1);
      return 1;
    }
    const v = 2 * go(k - 1, depth + 1) + go(k - 2, depth + 1);
    hooks.onReturn?.(depth, k, v);
    return v;
  };
  const result = go(n, 0);
  return { result, depth: maxDepth, calls };
}
