// 全付拍卖 · 实现 (给定报价计算收益)
export interface ApHooks {
  onBid?: (i: number, bid: number) => void;
  onOutcome?: (winner: number, maxBid: number, totalPaid: number) => void;
}
export function allPayAuction(
  bids: readonly number[],
  value: number,
  hooks: ApHooks = {},
): { winner: number; payoffs: number[] } {
  let winner = 0,
    max = -Infinity;
  for (let i = 0; i < bids.length; i++) {
    hooks.onBid?.(i, bids[i]!);
    if (bids[i]! > max) {
      max = bids[i]!;
      winner = i;
    }
  }
  const payoffs = bids.map((b, i) => (i === winner ? value - b : -b));
  hooks.onOutcome?.(
    winner,
    max,
    bids.reduce((a, b) => a + b, 0),
  );
  return { winner, payoffs };
}
