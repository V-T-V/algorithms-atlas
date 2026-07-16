// =============================================================================
// 三串 LCS · 三维 DP
// =============================================================================

export interface Lcs3Hooks {
  onCompare?: (i: number, j: number, k: number, eq: boolean) => void;
  onCell?: (i: number, j: number, k: number, val: number) => void;
  onDone?: (len: number) => void;
}

export function lcs3(s1: string, s2: string, s3: string, hooks: Lcs3Hooks = {}): number {
  const n1 = s1.length;
  const n2 = s2.length;
  const n3 = s3.length;
  const dp: number[][][] = Array.from({ length: n1 + 1 }, () =>
    Array.from({ length: n2 + 1 }, () => new Array<number>(n3 + 1).fill(0)),
  );
  for (let i = 1; i <= n1; i++) {
    for (let j = 1; j <= n2; j++) {
      for (let k = 1; k <= n3; k++) {
        const eq = s1[i - 1] === s2[j - 1] && s2[j - 1] === s3[k - 1];
        hooks.onCompare?.(i, j, k, eq);
        let v: number;
        if (eq) {
          v = dp[i - 1]![j - 1]![k - 1]! + 1;
        } else {
          v = Math.max(dp[i - 1]![j]![k]!, dp[i]![j - 1]![k]!, dp[i]![j]![k - 1]!);
        }
        dp[i]![j]![k] = v;
        hooks.onCell?.(i, j, k, v);
      }
    }
  }
  const ans = dp[n1]![n2]![n3]!;
  hooks.onDone?.(ans);
  return ans;
}
