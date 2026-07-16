export interface EaHooks {
  onExpr?: (e: string) => void;
  onResult?: (e: string) => void;
}
export function addOperators(num: string, target: number, hooks: EaHooks = {}): string[] {
  const out: string[] = [];
  const n = num.length;
  const dfs = (idx: number, prev: number, cur: number, expr: string) => {
    if (idx === n) {
      if (cur === target) {
        out.push(expr);
        hooks.onResult?.(expr);
      }
      return;
    }
    for (let i = idx; i < n; i++) {
      if (i > idx && num[idx] === '0') break;
      const valStr = num.slice(idx, i + 1);
      const val = Number(valStr);
      if (idx === 0) {
        dfs(i + 1, val, val, valStr);
        hooks.onExpr?.(valStr);
      } else {
        dfs(i + 1, val, cur + val, expr + '+' + valStr);
        dfs(i + 1, -val, cur - val, expr + '-' + valStr);
        dfs(i + 1, prev * val, cur - prev + prev * val, expr + '*' + valStr);
      }
    }
  };
  dfs(0, 0, 0, '');
  return out;
}
