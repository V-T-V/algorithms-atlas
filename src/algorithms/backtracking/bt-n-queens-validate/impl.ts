// =============================================================================
// N 皇后验证 · 纯算法实现
// 给定 cols[r] 表示第 r 行皇后所在列，验证是否为合法 N 皇后布局。
// =============================================================================
export interface BtNQueensValidateHooks {
  onCheckPair?: (r1: number, c1: number, r2: number, c2: number, ok: boolean) => void;
  onConclude?: (valid: boolean) => void;
}

export function btNQueensValidate(
  cols: readonly number[],
  hooks: BtNQueensValidateHooks = {},
): boolean {
  const n = cols.length;
  const seen = new Set<number>();
  for (let r = 0; r < n; r++) {
    const c = cols[r]!;
    if (c < 0 || c >= n) {
      hooks.onConclude?.(false);
      return false;
    }
    if (seen.has(c)) {
      hooks.onCheckPair?.(r, c, -1, c, false);
      hooks.onConclude?.(false);
      return false;
    }
    seen.add(c);
  }
  // 检查对角线
  for (let r1 = 0; r1 < n; r1++) {
    for (let r2 = r1 + 1; r2 < n; r2++) {
      const c1 = cols[r1]!;
      const c2 = cols[r2]!;
      const ok = Math.abs(r1 - r2) !== Math.abs(c1 - c2);
      hooks.onCheckPair?.(r1, c1, r2, c2, ok);
      if (!ok) {
        hooks.onConclude?.(false);
        return false;
      }
    }
  }
  hooks.onConclude?.(true);
  return true;
}
