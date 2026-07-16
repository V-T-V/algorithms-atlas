// 第一价格密封拍卖 · 实现
export interface FirstPriceHooks {
  onWinner?: (winnerIdx: number, bid: number) => void;
  onPayoff?: (idx: number, payoff: number) => void;
}
export interface FirstPriceResult {
  winnerIdx: number;
  payment: number;
  payoffs: number[];
}
export function gameFirstPrice(
  bids: readonly number[],
  values: readonly number[],
  hooks: FirstPriceHooks = {},
): FirstPriceResult {
  if (bids.length === 0) throw new Error('bids 不能为空 / bids must be non-empty');
  let winnerIdx = 0;
  let highest = bids[0]!;
  for (let i = 1; i < bids.length; i++)
    if (bids[i]! > highest) {
      highest = bids[i]!;
      winnerIdx = i;
    }
  hooks.onWinner?.(winnerIdx, highest);
  const payoffs = bids.map((_, i) => (i === winnerIdx ? values[i]! - highest : 0));
  payoffs.forEach((p, i) => hooks.onPayoff?.(i, p));
  return { winnerIdx, payment: highest, payoffs };
}
/** 对称风险中性竞拍者的均衡出价（n 人均匀估值）：v*(n-1)/n。 */
export function firstPriceEquilibriumBid(v: number, n: number): number {
  return (v * (n - 1)) / n;
}
