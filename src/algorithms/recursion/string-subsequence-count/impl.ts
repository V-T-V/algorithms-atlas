// 递归统计子序列出现次数 · 纯算法实现（带记忆化）

/** 事件钩子。 */
export interface SubseqHooks {
  /** 计算某状态 (i, j)。 */
  onCompute?: (i: number, j: number, hit: boolean) => void;
  /** 命中字符匹配（s[i-1] == t[j-1]）。 */
  onMatch?: (i: number, j: number, sc: string, tc: string) => void;
  /** 完成。 */
  onResult?: (count: number) => void;
}

/**
 * 统计 t 作为 s 子序列出现的次数（记忆化递归）。
 *
 * @param s 主串
 * @param t 模式串
 * @param hooks 可选事件钩子
 * @returns 出现次数
 */
export function countSubsequence(s: string, t: string, hooks: SubseqHooks = {}): number {
  const m = s.length;
  const n = t.length;
  // memo[i][j]：s 前 i 字符中 t 前 j 字符作为子序列的次数；-1 表示未算
  const memo: number[][] = Array.from({ length: m + 1 }, () => new Array<number>(n + 1).fill(-1));

  const solve = (i: number, j: number): number => {
    if (j === 0) return 1;
    if (i === 0) return 0;
    if (memo[i]![j]! >= 0) {
      hooks.onCompute?.(i, j, true);
      return memo[i]![j]!;
    }
    hooks.onCompute?.(i, j, false);
    const sc = s[i - 1]!;
    const tc = t[j - 1]!;
    let r: number;
    if (sc === tc) {
      hooks.onMatch?.(i, j, sc, tc);
      r = solve(i - 1, j - 1) + solve(i - 1, j);
    } else {
      r = solve(i - 1, j);
    }
    memo[i]![j] = r;
    return r;
  };

  const result = solve(m, n);
  hooks.onResult?.(result);
  return result;
}
