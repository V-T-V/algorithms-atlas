// =============================================================================
// 买卖股票最佳时机（单次）· 纯算法实现
// 维护最低价，逐日计算利润。
// =============================================================================

export interface BestTimeStockHooks {
  onDay?: (i: number, price: number, minPrice: number, profit: number) => void;
  onResult?: (profit: number) => void;
}

export function maxProfitOnce(prices: readonly number[], hooks: BestTimeStockHooks = {}): number {
  const n = prices.length;
  if (n === 0) {
    hooks.onResult?.(0);
    return 0;
  }
  let minPrice = prices[0]!;
  let profit = 0;
  hooks.onDay?.(0, prices[0]!, minPrice, profit);
  for (let i = 1; i < n; i++) {
    const p = prices[i]!;
    profit = Math.max(profit, p - minPrice);
    minPrice = Math.min(minPrice, p);
    hooks.onDay?.(i, p, minPrice, profit);
  }
  hooks.onResult?.(profit);
  return profit;
}
