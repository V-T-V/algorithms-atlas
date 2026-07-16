// =============================================================================
// 零钱兑换组合数 · 纯算法实现
// 完全背包组合数：外层硬币，内层 amount 正序。
// =============================================================================

export interface CoinChangeCountHooks {
  onCoin?: (i: number, coin: number) => void;
  onUpdate?: (j: number, val: number) => void;
  onResult?: (count: number) => void;
}

export function coinChangeCount(
  coins: readonly number[],
  amount: number,
  hooks: CoinChangeCountHooks = {},
): number {
  const dp: number[] = new Array<number>(amount + 1).fill(0);
  dp[0] = 1;
  for (let i = 0; i < coins.length; i++) {
    hooks.onCoin?.(i, coins[i]!);
    for (let j = coins[i]!; j <= amount; j++) {
      dp[j] = dp[j]! + dp[j - coins[i]!]!;
      hooks.onUpdate?.(j, dp[j]!);
    }
  }
  hooks.onResult?.(dp[amount]!);
  return dp[amount]!;
}
