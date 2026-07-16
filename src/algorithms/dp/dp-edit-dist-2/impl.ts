// =============================================================================
// Damerau-Levenshtein 距离 · 纯算法实现
// =============================================================================

export interface DamerauHooks {
  onCell?: (i: number, j: number, val: number) => void;
  onSwap?: (i: number, j: number) => void;
  onDone?: (d: number) => void;
}

export function damerauLevenshtein(s1: string, s2: string, hooks: DamerauHooks = {}): number {
  const n = s1.length;
  const m = s2.length;
  const W = m + 1;
  const dp = new Array<number>((n + 1) * W).fill(0);
  for (let i = 0; i <= n; i++) dp[i * W + 0] = i;
  for (let j = 0; j <= m; j++) dp[0 * W + j] = j;

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      let v = Math.min(
        dp[(i - 1) * W + j]! + 1, // delete
        dp[i * W + (j - 1)]! + 1, // insert
        dp[(i - 1) * W + (j - 1)]! + cost, // substitute
      );
      if (i >= 2 && j >= 2 && s1[i - 1] === s2[j - 2] && s1[i - 2] === s2[j - 1]) {
        const sw = dp[(i - 2) * W + (j - 2)]! + 1;
        if (sw < v) {
          v = sw;
          hooks.onSwap?.(i, j);
        }
      }
      dp[i * W + j] = v;
      hooks.onCell?.(i, j, v);
    }
  }
  const ans = dp[n * W + m]!;
  hooks.onDone?.(ans);
  return ans;
}
