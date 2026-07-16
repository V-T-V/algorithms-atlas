// =============================================================================
// 仓库调度 · 纯算法实现（状态机 DP，可视为单次买卖的滚动版本）
// hold = 持有 1 件的最大累计；cash = 不持有的最大累计。
// =============================================================================

export interface WarehouseHooks {
  onDay?: (i: number, price: number, hold: number, cash: number) => void;
  onResult?: (profit: number) => void;
}

export function warehouseScheduling(prices: readonly number[], hooks: WarehouseHooks = {}): number {
  const n = prices.length;
  if (n === 0) {
    hooks.onResult?.(0);
    return 0;
  }
  let cash = 0;
  let hold = -prices[0]!;
  hooks.onDay?.(0, prices[0]!, hold, cash);
  for (let i = 1; i < n; i++) {
    const p = prices[i]!;
    const prevCash = cash;
    cash = Math.max(cash, hold + p);
    hold = Math.max(hold, prevCash - p);
    hooks.onDay?.(i, p, hold, cash);
  }
  hooks.onResult?.(cash);
  return cash;
}
