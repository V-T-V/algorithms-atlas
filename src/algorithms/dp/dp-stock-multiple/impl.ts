// =============================================================================
// 买卖股票（多次）· 纯算法实现
// 贪心累加所有正向日差；或状态机 DP（这里用贪心，等价）。
// =============================================================================

export interface StockMultipleHooks {
  onDay?: (i: number, price: number, gain: number, profit: number) => void;
  onResult?: (profit: number) => void;
}

export function maxProfitMultiple(
  prices: readonly number[],
  hooks: StockMultipleHooks = {},
): number {
  const n = prices.length;
  if (n === 0) {
    hooks.onResult?.(0);
    return 0;
  }
  let profit = 0;
  for (let i = 0; i < n; i++) {
    let gain = 0;
    if (i > 0) {
      gain = Math.max(0, prices[i]! - prices[i - 1]!);
      profit += gain;
    }
    hooks.onDay?.(i, prices[i]!, gain, profit);
  }
  hooks.onResult?.(profit);
  return profit;
}
