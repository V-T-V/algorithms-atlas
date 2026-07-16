// =============================================================================
// 拍卖博弈（密封出价）· 纯算法实现
// =============================================================================
export interface GameAuctionHooks {
  onBid?: (player: number, bid: number) => void;
  onWinner?: (player: number, bid: number, payoff: number) => void;
  onConclude?: (winner: number, payoffs: number[]) => void;
}

export interface AuctionResult {
  winner: number;
  payoffs: number[];
}

export function gameAuction(
  bids: readonly number[],
  values: readonly number[],
  hooks: GameAuctionHooks = {},
): AuctionResult {
  bids.forEach((b, i) => hooks.onBid?.(i, b));
  let winner = 0;
  let highest = bids[0]!;
  for (let i = 1; i < bids.length; i++) {
    if (bids[i]! > highest) {
      highest = bids[i]!;
      winner = i;
    }
  }
  const payoffs = bids.map((_, i) => (i === winner ? values[i]! - bids[i]! : 0));
  hooks.onWinner?.(winner, highest, payoffs[winner]!);
  hooks.onConclude?.(winner, payoffs);
  return { winner, payoffs };
}
