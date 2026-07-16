// 递归整数划分 · 实现
export interface PartitionHooks {
  onRecurse?: (depth: number, n: number, k: number) => void;
  onBase?: (depth: number, value: number) => void;
  onReturn?: (depth: number, value: number) => void;
}
export interface PartitionResult {
  result: number;
  depth: number;
  calls: number;
}
export function recPartitionRec(n: number, k: number, hooks: PartitionHooks = {}): PartitionResult {
  let calls = 0;
  let maxDepth = 0;
  const go = (a: number, b: number, depth: number): number => {
    calls++;
    maxDepth = Math.max(maxDepth, depth);
    hooks.onRecurse?.(depth, a, b);
    if (a === 0) {
      hooks.onBase?.(depth, 1);
      return 1;
    }
    if (b === 0 || a < 0) {
      hooks.onBase?.(depth, 0);
      return 0;
    }
    const v = go(a, b - 1, depth + 1) + go(a - b, b, depth + 1);
    hooks.onReturn?.(depth, v);
    return v;
  };
  const result = go(n, k, 0);
  return { result, depth: maxDepth, calls };
}
