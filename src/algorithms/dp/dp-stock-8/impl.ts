// =============================================================================
// 买卖股票（含手续费）· 纯算法实现
// =============================================================================
export interface StockFeeHooks {
  onDay?: (i: number, price: number, hold: number, cash: number) => void;
  onDone?: (profit: number) => void;
}

export function maxProfitFee(
  prices: readonly number[],
  fee: number,
  hooks: StockFeeHooks = {},
): number {
  if (prices.length === 0) {
    hooks.onDone?.(0);
    return 0;
  }
  let cash = 0,
    hold = -prices[0]!;
  for (let i = 1; i < prices.length; i++) {
    const p = prices[i]!;
    const newHold = Math.max(hold, cash - p);
    const newCash = Math.max(cash, hold + p - fee);
    hold = newHold;
    cash = newCash;
    hooks.onDay?.(i, p, hold, cash);
  }
  hooks.onDone?.(cash);
  return cash;
}
