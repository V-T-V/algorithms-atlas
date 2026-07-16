// =============================================================================
// 分割回文串 II（Palindrome Partitioning II）· 纯算法实现
// 区间 DP 预处理回文 + 回溯/DP 求最少分割次数。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选。 */
export interface SplitPalindromeHooks {
  /** 预处理完成，给出回文表 isPal。 */
  onPrecompute?: (isPal: boolean[][]) => void;
  /** 在右端点 end 处，尝试用 [start..end] 这段回文转移。 */
  onTryCut?: (start: number, end: number, prevCuts: number, newCuts: number) => void;
  /** 更新 dp[end] 到更优值。 */
  onUpdate?: (end: number, cuts: number) => void;
  /** 记忆化命中（已有更优或相等值）。 */
  onMemoHit?: (end: number, cuts: number) => void;
}

/**
 * 求把字符串分割成回文子串的最少分割次数。
 *
 * @param s 源字符串
 * @param hooks 可选事件钩子
 * @returns 最少分割次数（若 s 本身是回文，返回 0）
 */
export function splitPalindrome(s: string, hooks: SplitPalindromeHooks = {}): number {
  const n = s.length;
  if (n <= 1) return 0;

  // 1) 区间 DP：isPal[i][j] = s[i..j] 是否回文
  const isPal: boolean[][] = Array.from({ length: n }, () => new Array<boolean>(n).fill(false));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = i; j < n; j++) {
      if (s[i] === s[j] && (j - i < 2 || isPal[i + 1]![j - 1]!)) {
        isPal[i]![j] = true;
      }
    }
  }
  hooks.onPrecompute?.(isPal);

  // 2) dp[i] = s[0..i] 的最少分割次数；回溯视角：
  //    从起点出发，每次挑一个回文段 [0..i]，再递归处理 [i+1..]。
  //    用记忆化记录到达位置 pos 时的最小分割次数。
  const memo = new Map<number, number>();

  const backtrack = (pos: number): number => {
    if (pos === n) return -1; // 已无剩余，分割次数 = 段数-1
    if (memo.has(pos)) {
      hooks.onMemoHit?.(pos, memo.get(pos)!);
      return memo.get(pos)!;
    }
    let best = Infinity;
    for (let end = pos; end < n; end++) {
      if (!isPal[pos]![end]!) continue;
      const sub = backtrack(end + 1);
      const cuts = sub === -1 ? 0 : sub + 1;
      hooks.onTryCut?.(pos, end, sub === -1 ? 0 : sub, cuts);
      if (cuts < best) {
        best = cuts;
        hooks.onUpdate?.(end, cuts);
      }
    }
    memo.set(pos, best);
    return best;
  };

  return backtrack(0);
}

/** 构造一组最少分割方案（返回各回文段）。 */
export function splitPalindromePlan(s: string): string[] {
  const n = s.length;
  if (n === 0) return [];
  const isPal: boolean[][] = Array.from({ length: n }, () => new Array<boolean>(n).fill(false));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = i; j < n; j++) {
      if (s[i] === s[j] && (j - i < 2 || isPal[i + 1]![j - 1]!)) {
        isPal[i]![j] = true;
      }
    }
  }
  // dp[i] = [最少分割次数, 最佳上一切点 j]
  const dp: Array<{ cuts: number; cut: number }> = Array.from({ length: n + 1 }, () => ({
    cuts: Infinity,
    cut: -1,
  }));
  dp[0]! = { cuts: 0, cut: -1 };
  for (let i = 1; i <= n; i++) {
    for (let j = 0; j < i; j++) {
      if (isPal[j]![i - 1]! && dp[j]!.cuts + 1 < dp[i]!.cuts) {
        dp[i]! = { cuts: dp[j]!.cuts + 1, cut: j };
      }
    }
  }
  // 回溯切点构造段
  const segs: string[] = [];
  let i = n;
  while (i > 0) {
    const j = dp[i]!.cut;
    segs.unshift(s.slice(j, i));
    i = j;
  }
  return segs;
}
