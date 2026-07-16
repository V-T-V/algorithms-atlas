// =============================================================================
// 正则匹配回溯 · 纯算法实现
// 带 memo 的回溯 (LeetCode 10)。
// =============================================================================
export interface BtRegexHooks {
  onMatch?: (i: number, j: number) => void;
  onStar?: (i: number, j: number) => void;
}

export function btRegexMatching(s: string, p: string, hooks: BtRegexHooks = {}): boolean {
  const m = s.length,
    n = p.length;
  const memo = new Map<string, boolean>();

  const dfs = (i: number, j: number): boolean => {
    const key = `${i},${j}`;
    if (memo.has(key)) return memo.get(key)!;
    if (j === n) {
      const r = i === m;
      memo.set(key, r);
      return r;
    }
    const first = i < m && (p[j] === s[i] || p[j] === '.');
    let r: boolean;
    if (j + 1 < n && p[j + 1] === '*') {
      hooks.onStar?.(i, j);
      // 丢弃 x*  或 匹配一个再保留 x*
      r = dfs(i, j + 2) || (first && dfs(i + 1, j));
    } else {
      hooks.onMatch?.(i, j);
      r = first && dfs(i + 1, j + 1);
    }
    memo.set(key, r);
    return r;
  };

  return dfs(0, 0);
}
