// =============================================================================
// 拍卖博弈框架 · 纯算法实现
// 支持 first-price / second-price / all-pay 三种密封投标。
// 中标者：最高出价（并列时取索引最小）；同价值时随机性由输入控制。
// =============================================================================
export type AuctionType = 'first-price' | 'second-price' | 'all-pay';

export interface AuctionHooks {
  onHighestBid?: (winnerIdx: number, highestBid: number, secondBid: number) => void;
  onPayoff?: (idx: number, payoff: number) => void;
}

export interface AuctionResult {
  winnerIdx: number;
  payment: number;
  payoffs: number[];
}

export function gameAuction2(
  bids: readonly number[],
  values: readonly number[],
  type: AuctionType = 'second-price',
  hooks: AuctionHooks = {},
): AuctionResult {
  if (bids.length === 0) throw new Error('bids 不能为空 / bids must be non-empty');
  let winnerIdx = 0;
  let highest = bids[0]!;
  let second = -Infinity;
  for (let i = 1; i < bids.length; i++) {
    if (bids[i]! > highest) {
      second = highest;
      highest = bids[i]!;
      winnerIdx = i;
    } else if (bids[i]! > second) {
      second = bids[i]!;
    }
  }
  if (second === -Infinity) second = highest;
  let payment: number;
  if (type === 'first-price') payment = highest;
  else if (type === 'second-price') payment = second;
  else payment = highest; // all-pay 在 payoff 中处理
  hooks.onHighestBid?.(winnerIdx, highest, second);
  const payoffs: number[] = new Array(bids.length).fill(0);
  for (let i = 0; i < bids.length; i++) {
    if (type === 'all-pay') {
      payoffs[i] = (i === winnerIdx ? values[i]! : 0) - bids[i]!;
    } else {
      payoffs[i] = i === winnerIdx ? values[i]! - payment : 0;
    }
    hooks.onPayoff?.(i, payoffs[i]!);
  }
  return { winnerIdx, payment, payoffs };
}
