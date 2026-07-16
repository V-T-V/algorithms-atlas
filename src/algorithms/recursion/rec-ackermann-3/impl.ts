// 阿克曼函数 · 实现
export interface AckermannHooks {
  onRecurse?: (depth: number, m: number, n: number) => void;
  onBase?: (depth: number, value: number) => void;
  onReturn?: (depth: number, value: number) => void;
}
export interface AckermannResult {
  result: number;
  depth: number;
  calls: number;
}
export function recAckermann3(m: number, n: number, hooks: AckermannHooks = {}): AckermannResult {
  let calls = 0;
  let maxDepth = 0;
  const go = (a: number, b: number, depth: number): number => {
    calls++;
    maxDepth = Math.max(maxDepth, depth);
    hooks.onRecurse?.(depth, a, b);
    if (a === 0) {
      const v = b + 1;
      hooks.onBase?.(depth, v);
      return v;
    }
    if (b === 0) {
      const v = go(a - 1, 1, depth + 1);
      hooks.onReturn?.(depth, v);
      return v;
    }
    const inner = go(a, b - 1, depth + 1);
    const v = go(a - 1, inner, depth + 1);
    hooks.onReturn?.(depth, v);
    return v;
  };
  const result = go(m, n, 0);
  return { result, depth: maxDepth, calls };
}
