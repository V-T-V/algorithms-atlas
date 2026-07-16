// =============================================================================
// 回文分割最少切割 · 纯算法实现
// 预处理 isPal + dp[i] = s[0..i] 最少切割次数。
// =============================================================================

export interface PalindromicCutHooks {
  onCut?: (i: number, cuts: number) => void;
  onResult?: (cuts: number) => void;
}

export function minCutPalindrome(s: string, hooks: PalindromicCutHooks = {}): number {
  const n = s.length;
  if (n <= 1) {
    hooks.onResult?.(0);
    return 0;
  }
  // isPal[i][j]
  const isPal: boolean[][] = Array.from({ length: n }, () => new Array<boolean>(n).fill(false));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = i; j < n; j++) {
      if (s[i] === s[j] && (j - i < 2 || isPal[i + 1]![j - 1]!)) isPal[i]![j] = true;
    }
  }
  const dp: number[] = new Array<number>(n).fill(0);
  for (let i = 0; i < n; i++) {
    if (isPal[0]![i]!) {
      dp[i] = 0;
    } else {
      dp[i] = i; // 最多切 i 刀
      for (let j = 1; j <= i; j++) {
        if (isPal[j]![i]!) dp[i] = Math.min(dp[i]!, dp[j - 1]! + 1);
      }
    }
    hooks.onCut?.(i, dp[i]!);
  }
  hooks.onResult?.(dp[n - 1]!);
  return dp[n - 1]!;
}
