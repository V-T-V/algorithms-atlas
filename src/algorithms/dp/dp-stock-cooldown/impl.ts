// =============================================================================
// 含冷冻期股票 · 纯算法实现
// 三态状态机：hold / sold / rest。
// =============================================================================

export interface StockCooldownHooks {
  onDay?: (i: number, price: number, hold: number, sold: number, rest: number) => void;
  onResult?: (profit: number) => void;
}

export function maxProfitCooldown(
  prices: readonly number[],
  hooks: StockCooldownHooks = {},
): number {
  const n = prices.length;
  if (n === 0) {
    hooks.onResult?.(0);
    return 0;
  }
  let hold = -prices[0]!;
  let sold = -Infinity;
  let rest = 0;
  hooks.onDay?.(0, prices[0]!, hold, sold, rest);
  for (let i = 1; i < n; i++) {
    const p = prices[i]!;
    const prevHold = hold;
    const prevSold = sold;
    hold = Math.max(hold, rest - p);
    rest = Math.max(rest, prevSold);
    sold = prevHold + p;
    hooks.onDay?.(i, p, hold, sold, rest);
  }
  const ans = Math.max(sold, rest);
  hooks.onResult?.(ans);
  return ans;
}
