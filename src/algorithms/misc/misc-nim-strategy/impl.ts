// Nim 取胜策略 · 实现
export interface NsHooks {
  onConclude?: (firstWins: boolean, pile: number, take: number) => void;
}
export function nimStrategy(
  piles: readonly number[],
  hooks: NsHooks = {},
): { firstWins: boolean; pile: number; take: number } {
  const nimSum = piles.reduce((a, b) => a ^ b, 0);
  if (nimSum === 0) {
    hooks.onConclude?.(false, -1, 0);
    return { firstWins: false, pile: -1, take: 0 };
  }
  for (let i = 0; i < piles.length; i++) {
    const t = piles[i]! ^ nimSum;
    if (t < piles[i]!) {
      const take = piles[i]! - t;
      hooks.onConclude?.(true, i, take);
      return { firstWins: true, pile: i, take };
    }
  }
  hooks.onConclude?.(false, -1, 0);
  return { firstWins: false, pile: -1, take: 0 };
}
