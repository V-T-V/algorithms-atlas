// =============================================================================
// 股票 VII：无限次 + 冷冻期
// =============================================================================

export interface StockCooldownHooks {
  onDay?: (i: number, hold: number, cash: number, cool: number) => void;
  onDone?: (profit: number) => void;
}

export function maxProfitCooldown(
  prices: readonly number[],
  hooks: StockCooldownHooks = {},
): number {
  if (prices.length === 0) return 0;
  let hold = -prices[0]!;
  let cash = 0;
  let cool = 0;
  for (let i = 1; i < prices.length; i++) {
    const p = prices[i]!;
    const newCool = hold + p;
    const newCash = Math.max(cash, cool);
    const newHold = Math.max(hold, cash - p);
    cool = newCool;
    cash = newCash;
    hold = newHold;
    hooks.onDay?.(i, hold, cash, cool);
  }
  const ans = Math.max(cash, cool);
  hooks.onDone?.(ans);
  return ans;
}
