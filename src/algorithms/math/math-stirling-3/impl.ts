// =============================================================================
// 第二类 Stirling 数
// =============================================================================

const MOD = 1_000_000_007n;

export interface StirlingHooks {
  onCell?: (n: number, k: number, value: bigint) => void;
  onDone?: (table: bigint[][]) => void;
}

export function stirling2(n: number, k: number, hooks: StirlingHooks = {}): bigint {
  const dp: bigint[][] = Array.from({ length: n + 1 }, () => new Array(k + 1).fill(0n));
  dp[0]![0] = 1n;
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= k; j++) {
      dp[i]![j] = (BigInt(j) * dp[i - 1]![j]! + dp[i - 1]![j - 1]!) % MOD;
      hooks.onCell?.(i, j, dp[i]![j]!);
    }
  }
  hooks.onDone?.(dp);
  return dp[n]![k]!;
}
