// =============================================================================
// 含手续费股票 · 纯算法实现
// hold / cash 两态状态机，卖出扣手续费。
// =============================================================================

export interface StockFeeHooks {
  onDay?: (i: number, price: number, hold: number, cash: number) => void;
  onResult?: (profit: number) => void;
}

export function maxProfitWithFee(
  prices: readonly number[],
  fee: number,
  hooks: StockFeeHooks = {},
): number {
  const n = prices.length;
  if (n === 0) {
    hooks.onResult?.(0);
    return 0;
  }
  let hold = -prices[0]!;
  let cash = 0;
  hooks.onDay?.(0, prices[0]!, hold, cash);
  for (let i = 1; i < n; i++) {
    const p = prices[i]!;
    const prevHold = hold;
    hold = Math.max(hold, cash - p);
    cash = Math.max(cash, prevHold + p - fee);
    hooks.onDay?.(i, p, hold, cash);
  }
  hooks.onResult?.(cash);
  return cash;
}
