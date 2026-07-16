// =============================================================================
// 股票 VI：无限次 + 手续费
// =============================================================================

export interface StockFeeHooks {
  onDay?: (i: number, price: number, cash: number, hold: number) => void;
  onDone?: (profit: number) => void;
}

export function maxProfitFee(
  prices: readonly number[],
  fee: number,
  hooks: StockFeeHooks = {},
): number {
  let cash = 0;
  let hold = -prices[0]!;
  for (let i = 1; i < prices.length; i++) {
    const p = prices[i]!;
    const newCash = Math.max(cash, hold + p - fee);
    const newHold = Math.max(hold, cash - p);
    cash = newCash;
    hold = newHold;
    hooks.onDay?.(i, p, cash, hold);
  }
  hooks.onDone?.(cash);
  return cash;
}
