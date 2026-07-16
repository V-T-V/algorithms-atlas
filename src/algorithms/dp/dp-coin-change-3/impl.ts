// =============================================================================
// 零钱兑换（字典序最小方案）· 纯算法实现
// =============================================================================

export interface CoinChangeLexHooks {
  onInit?: (amount: number) => void;
  onUpdate?: (amt: number, val: number) => void;
  onDone?: (count: number, coins: number[]) => void;
}

export interface CoinChangeLexResult {
  count: number;
  coins: number[];
}

export function coinChangeLex(
  coins: readonly number[],
  amount: number,
  hooks: CoinChangeLexHooks = {},
): CoinChangeLexResult {
  const INF = Number.POSITIVE_INFINITY;
  const dp = new Array<number>(amount + 1).fill(INF);
  dp[0] = 0;
  hooks.onInit?.(amount);
  const sorted = [...coins].sort((a, b) => a - b);
  for (let i = 1; i <= amount; i++) {
    for (const c of sorted) {
      if (c > i) break;
      if (dp[i - c]! + 1 < dp[i]!) dp[i] = dp[i - c]! + 1;
    }
    hooks.onUpdate?.(i, dp[i]!);
  }
  if (dp[amount]! === INF) {
    hooks.onDone?.(-1, []);
    return { count: -1, coins: [] };
  }
  // 贪心构造字典序最小：每次取最小的可行硬币
  const chosen: number[] = [];
  let rest = amount;
  while (rest > 0) {
    for (const c of sorted) {
      if (c <= rest && dp[rest]! === dp[rest - c]! + 1) {
        chosen.push(c);
        rest -= c;
        break;
      }
    }
  }
  hooks.onDone?.(dp[amount]!, chosen);
  return { count: dp[amount]!, coins: chosen };
}
