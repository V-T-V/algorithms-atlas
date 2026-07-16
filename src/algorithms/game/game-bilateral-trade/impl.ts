// 双边贸易 (固定价格机制) · 实现
export interface TradeHooks {
  onPrice?: (p: number, trades: boolean, welfare: number) => void;
  onConclude?: (bestPrice: number, bestWelfare: number) => void;
}
export function bilateralTrade(
  buyerVal: number,
  sellerCost: number,
  prices: readonly number[],
  hooks: TradeHooks = {},
): { bestPrice: number; bestWelfare: number } {
  let bestPrice = 0,
    bestWelfare = -Infinity;
  for (const p of prices) {
    const trades = buyerVal >= p && p >= sellerCost;
    const welfare = trades ? buyerVal - sellerCost : 0;
    hooks.onPrice?.(p, trades, welfare);
    if (welfare > bestWelfare) {
      bestWelfare = welfare;
      bestPrice = p;
    }
  }
  hooks.onConclude?.(bestPrice, bestWelfare);
  return { bestPrice, bestWelfare };
}
