// 维克里拍卖 · 实现（密封二价）
export interface VickreyHooks {
  onWinner?: (winnerIdx: number, winningBid: number, price: number) => void;
  onPayoff?: (idx: number, payoff: number) => void;
}
export interface VickreyResult {
  winnerIdx: number;
  price: number;
  payoffs: number[];
}
export function gameVickrey(
  bids: readonly number[],
  values: readonly number[],
  hooks: VickreyHooks = {},
): VickreyResult {
  if (bids.length < 2) throw new Error('至少需要 2 位竞拍者 / need at least 2 bidders');
  let winnerIdx = 0;
  let highest = bids[0]!;
  let second = -Infinity;
  for (let i = 1; i < bids.length; i++) {
    if (bids[i]! > highest) {
      second = highest;
      highest = bids[i]!;
      winnerIdx = i;
    } else if (bids[i]! > second) second = bids[i]!;
  }
  if (second === -Infinity) second = highest;
  const price = second;
  hooks.onWinner?.(winnerIdx, highest, price);
  const payoffs = bids.map((_, i) => (i === winnerIdx ? values[i]! - price : 0));
  payoffs.forEach((p, i) => hooks.onPayoff?.(i, p));
  return { winnerIdx, price, payoffs };
}
