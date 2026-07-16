// 硬币找零（贪心）· 实现
export interface CoinHooks {
  onUse?: (denom: number, count: number) => void;
  onConclude?: (totalCoins: number, used: Record<number, number>) => void;
}
export interface CoinResult {
  totalCoins: number;
  used: Record<number, number>;
  ok: boolean;
}
export function greedyCoinGreedy(
  amount: number,
  denoms: ReadonlyArray<number>,
  hooks: CoinHooks = {},
): CoinResult {
  const sorted = [...denoms].sort((a, b) => b - a);
  let rem = amount;
  const used: Record<number, number> = {};
  let totalCoins = 0;
  for (const d of sorted) {
    if (rem <= 0) break;
    const cnt = Math.floor(rem / d);
    if (cnt > 0) {
      used[d] = cnt;
      rem -= cnt * d;
      totalCoins += cnt;
      hooks.onUse?.(d, cnt);
    }
  }
  const ok = rem === 0;
  hooks.onConclude?.(totalCoins, used);
  return { totalCoins, used, ok };
}
