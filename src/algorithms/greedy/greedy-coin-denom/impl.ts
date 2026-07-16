// 贪心找零验证 · 实现
export interface GcdHooks {
  onCoin?: (c: number, greedy: number, optimal: number, ok: boolean) => void;
  onConclude?: (canonical: boolean) => void;
}
export function greedyCoinDenom(
  coins: readonly number[],
  maxAmount: number,
  hooks: GcdHooks = {},
): boolean {
  const greedy = (amt: number): number => {
    let cnt = 0;
    for (let i = coins.length - 1; i >= 0; i--) {
      cnt += Math.floor(amt / coins[i]!);
      amt %= coins[i]!;
    }
    return cnt;
  };
  const dp = new Array<number>(maxAmount + 1).fill(Infinity);
  dp[0] = 0;
  for (let a = 1; a <= maxAmount; a++)
    for (const c of coins) if (c <= a) dp[a] = Math.min(dp[a]!, dp[a - c]! + 1);
  let canonical = true;
  for (let a = 1; a <= maxAmount; a++) {
    const g = greedy(a),
      d = dp[a]!;
    const ok = g === d;
    hooks.onCoin?.(a, g, d, ok);
    if (!ok) canonical = false;
  }
  hooks.onConclude?.(canonical);
  return canonical;
}
