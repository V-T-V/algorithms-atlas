// =============================================================================
// 买卖股票（冷冻期）· 纯算法实现
// =============================================================================
export interface StockCoolHooks {
  onDay?: (i: number, price: number, hold: number, cash: number, cool: number) => void;
  onDone?: (profit: number) => void;
}

export function maxProfitCooldown(prices: readonly number[], hooks: StockCoolHooks = {}): number {
  if (prices.length === 0) {
    hooks.onDone?.(0);
    return 0;
  }
  let hold = -prices[0]!,
    cash = 0,
    cool = 0;
  for (let i = 1; i < prices.length; i++) {
    const p = prices[i]!;
    const newCool = hold + p;
    const newHold = Math.max(hold, cash - p);
    const newCash = Math.max(cash, cool);
    hold = newHold;
    cool = newCool;
    cash = newCash;
    hooks.onDay?.(i, p, hold, cash, cool);
  }
  const ans = Math.max(cash, cool);
  hooks.onDone?.(ans);
  return ans;
}
