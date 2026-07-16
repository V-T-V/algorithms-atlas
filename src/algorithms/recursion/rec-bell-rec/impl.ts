// 递归贝尔数 · 实现（使用第二类斯特林数之和）
export interface BellHooks {
  onRecurse?: (depth: number, n: number) => void;
  onReturn?: (depth: number, value: number) => void;
}
export interface BellResult {
  result: number;
  depth: number;
  calls: number;
}
export function recBellRec(n: number, hooks: BellHooks = {}): BellResult {
  let calls = 0;
  let maxDepth = 0;
  const sterling = (a: number, b: number, depth: number): number => {
    calls++;
    maxDepth = Math.max(maxDepth, depth);
    if (a === 0 && b === 0) return 1;
    if (a === 0 || b === 0 || b > a) return 0;
    return b * sterling(a - 1, b, depth + 1) + sterling(a - 1, b - 1, depth + 1);
  };
  hooks.onRecurse?.(0, n);
  let sum = 0;
  for (let k = 0; k <= n; k++) sum += sterling(n, k, 1);
  hooks.onReturn?.(0, sum);
  return { result: sum, depth: maxDepth, calls };
}
