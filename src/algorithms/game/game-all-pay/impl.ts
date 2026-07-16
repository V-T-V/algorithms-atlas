// 全付拍卖 · 实现
export interface AllPayHooks {
  onWinner?: (winnerIdx: number, highestBid: number) => void;
  onPayoff?: (idx: number, payoff: number) => void;
}
export interface AllPayResult {
  winnerIdx: number;
  payoffs: number[];
  totalPaid: number;
}
export function gameAllPay(
  bids: readonly number[],
  values: readonly number[],
  hooks: AllPayHooks = {},
): AllPayResult {
  if (bids.length === 0) throw new Error('bids 不能为空 / bids must be non-empty');
  let winnerIdx = 0;
  let highest = bids[0]!;
  for (let i = 1; i < bids.length; i++)
    if (bids[i]! > highest) {
      highest = bids[i]!;
      winnerIdx = i;
    }
  hooks.onWinner?.(winnerIdx, highest);
  const payoffs = bids.map((b, i) => (i === winnerIdx ? values[i]! - b : -b));
  let totalPaid = 0;
  payoffs.forEach((p, i) => {
    hooks.onPayoff?.(i, p);
    totalPaid += bids[i]!;
  });
  return { winnerIdx, payoffs, totalPaid };
}
