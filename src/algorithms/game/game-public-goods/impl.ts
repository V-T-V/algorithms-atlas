// 公共物品博弈 · 实现
export interface PgHooks {
  onInvest?: (i: number, g: number) => void;
  onPayoff?: (i: number, payoff: number) => void;
}
export function publicGoodsGame(
  endowment: number,
  contributions: readonly number[],
  m: number,
  hooks: PgHooks = {},
): number[] {
  const n = contributions.length;
  const G = contributions.reduce((a, b) => a + b, 0);
  const shared = (m * G) / n;
  const payoffs = contributions.map((g, i) => {
    hooks.onInvest?.(i, g);
    const p = endowment - g + shared;
    hooks.onPayoff?.(i, p);
    return p;
  });
  return payoffs;
}
