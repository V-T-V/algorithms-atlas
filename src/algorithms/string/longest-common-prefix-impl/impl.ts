// =============================================================================
// 最长公共前缀（多串）· 纯算法实现
// 纵向扫描。零 DOM 依赖，可独立单测。
// =============================================================================

export interface LCPHooks {
  /** 比较第 col 列各串的字符（base 为基准字符）。 */
  onColumnCompare?: (col: number, base: string, allEqual: boolean) => void;
  /** 第 col 列出现分歧或越界，停止。 */
  onDiverge?: (col: number, reason: 'short' | 'diff') => void;
  /** 完成一列（全相等），纳入前缀。 */
  onColumnMatch?: (col: number, char: string) => void;
}

/**
 * 计算一组字符串的最长公共前缀。
 * 纵向扫描：以首串为基准，逐列比较所有串。
 * 时间 O(S)，空间 O(1)。
 */
export function longestCommonPrefix(strs: readonly string[], hooks: LCPHooks = {}): string {
  if (strs.length === 0) return '';
  const first = strs[0]!;
  for (let col = 0; col < first.length; col++) {
    const base = first[col]!;
    let allEqual = true;
    for (let s = 1; s < strs.length; s++) {
      const cur = strs[s]!;
      if (col >= cur.length) {
        hooks.onDiverge?.(col, 'short');
        return first.slice(0, col);
      }
      if (cur[col] !== base) {
        allEqual = false;
        hooks.onColumnCompare?.(col, base, false);
        hooks.onDiverge?.(col, 'diff');
        return first.slice(0, col);
      }
    }
    hooks.onColumnCompare?.(col, base, allEqual);
    hooks.onColumnMatch?.(col, base);
  }
  return first;
}
