// =============================================================================
// 买卖股票含冷冻期 · 纯算法实现
// =============================================================================

export interface StockCooldownHooks {
  onDay?: (i: number, price: number, hold: number, sold: number, rest: number) => void;
  onDone?: (profit: number) => void;
}

export function stockCooldown(prices: readonly number[], hooks: StockCooldownHooks = {}): number {
  if (prices.length === 0) {
    hooks.onDone?.(0);
    return 0;
  }
  let hold = -prices[0]!;
  let sold = 0;
  let rest = 0;
  for (let i = 1; i < prices.length; i++) {
    const prevSold = sold;
    sold = hold + prices[i]!;
    hold = Math.max(hold, rest - prices[i]!);
    rest = Math.max(rest, prevSold);
    hooks.onDay?.(i, prices[i]!, hold, sold, rest);
  }
  const ans = Math.max(sold, rest);
  hooks.onDone?.(ans);
  return ans;
}
