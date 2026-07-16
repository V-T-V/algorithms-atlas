// =============================================================================
// 零钱兑换（最少硬币）· 纯算法实现
// =============================================================================
export interface CoinHooks {
  onAmount?: (amt: number) => void;
  onRelax?: (amt: number, coin: number, val: number) => void;
  onDone?: (min: number) => void;
}

export function coinChange(
  coins: readonly number[],
  amount: number,
  hooks: CoinHooks = {},
): number {
  const INF = Number.POSITIVE_INFINITY;
  const dp = new Array<number>(amount + 1).fill(INF);
  dp[0] = 0;
  for (let i = 1; i <= amount; i++) {
    hooks.onAmount?.(i);
    for (const c of coins) {
      if (c <= i && dp[i - c]! + 1 < dp[i]!) {
        dp[i] = dp[i - c]! + 1;
        hooks.onRelax?.(i, c, dp[i]!);
      }
    }
  }
  const ans = dp[amount]!;
  const out = ans === INF ? -1 : ans;
  hooks.onDone?.(out);
  return out;
}
