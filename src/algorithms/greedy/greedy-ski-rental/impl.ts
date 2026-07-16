// 租雪板 · 实现
export interface SrHooks {
  onDay?: (day: number, action: 'rent' | 'buy', total: number) => void;
  onConclude?: (total: number, ratio: number) => void;
}
export function skiRental(
  days: number,
  rentPrice: number,
  buyPrice: number,
  hooks: SrHooks = {},
): { total: number; bought: boolean } {
  const threshold = Math.floor(buyPrice / rentPrice);
  let total = 0,
    bought = false;
  for (let d = 1; d <= days; d++) {
    if (!bought && d > threshold) {
      bought = true;
      total += buyPrice;
      hooks.onDay?.(d, 'buy', total);
    } else {
      total += rentPrice;
      hooks.onDay?.(d, 'rent', total);
    }
  }
  const offline = Math.min(days * rentPrice, buyPrice);
  hooks.onConclude?.(total, total / offline);
  return { total, bought };
}
