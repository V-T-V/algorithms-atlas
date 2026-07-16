// =============================================================================
// 零钱兑换：DP 最优解 + 贪心对照
// =============================================================================

export interface CoinChangeHooks {
  onCell?: (a: number, val: number) => void;
  onDone?: (dp: number, greedy: number) => void;
}

export interface CoinChangeResult {
  dp: number;
  greedy: number;
  greedyOptimal: boolean;
}

export function coinChangeCompare(
  coins: readonly number[],
  amount: number,
  hooks: CoinChangeHooks = {},
): CoinChangeResult {
  const INF = Number.POSITIVE_INFINITY;
  const dp = new Array<number>(amount + 1).fill(INF);
  dp[0] = 0;
  for (let a = 1; a <= amount; a++) {
    for (const c of coins) {
      if (c <= a && dp[a - c]! + 1 < dp[a]!) {
        dp[a] = dp[a - c]! + 1;
      }
    }
    hooks.onCell?.(a, dp[a]!);
  }
  // 贪心：从大面值起
  let rem = amount;
  let greedy = 0;
  const sorted = [...coins].sort((x, y) => y - x);
  for (const c of sorted) {
    while (rem >= c) {
      rem -= c;
      greedy++;
    }
  }
  const dpAns = Number.isFinite(dp[amount]!) ? dp[amount]! : -1;
  const greedyAns = rem === 0 ? greedy : -1;
  hooks.onDone?.(dpAns, greedyAns);
  return { dp: dpAns, greedy: greedyAns, greedyOptimal: dpAns === greedyAns };
}
