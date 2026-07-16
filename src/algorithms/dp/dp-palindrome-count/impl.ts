// =============================================================================
// 回文子串计数 · 纯算法实现
// 区间 DP：isPal[i][j] 表示 s[i..j] 是否为回文。
//   长度 1: true；长度 2: s[i]==s[j]；
//   长度≥3: s[i]==s[j] && isPal[i+1][j-1]。统计 true 个数。
// =============================================================================

export interface PalindromeCountHooks {
  onCheck?: (i: number, j: number, isPal: boolean) => void;
  onResult?: (total: number) => void;
}

export function countPalindromeSubstrings(s: string, hooks: PalindromeCountHooks = {}): number {
  const n = s.length;
  if (n === 0) {
    hooks.onResult?.(0);
    return 0;
  }
  const isPal: boolean[][] = Array.from({ length: n }, () => new Array<boolean>(n).fill(false));
  let total = 0;
  // 按长度递增
  for (let len = 1; len <= n; len++) {
    for (let i = 0; i + len - 1 < n; i++) {
      const j = i + len - 1;
      let pal = false;
      if (len === 1) pal = true;
      else if (len === 2) pal = s[i] === s[j];
      else pal = s[i] === s[j] && isPal[i + 1]![j - 1]!;
      isPal[i]![j] = pal;
      if (pal) total++;
      hooks.onCheck?.(i, j, pal);
    }
  }
  hooks.onResult?.(total);
  return total;
}
