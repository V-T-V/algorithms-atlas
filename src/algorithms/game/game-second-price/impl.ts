// 第二价格拍卖 · 实现（与 game-auction-2 second-price 等价但独立、强调占优策略）
export interface SecondPriceHooks {
  onWinner?: (winnerIdx: number, price: number) => void;
  onPayoff?: (idx: number, payoff: number) => void;
}
export interface SecondPriceResult {
  winnerIdx: number;
  price: number;
  payoffs: number[];
}
export function gameSecondPrice(
  bids: readonly number[],
  values: readonly number[],
  hooks: SecondPriceHooks = {},
): SecondPriceResult {
  if (bids.length < 1) throw new Error('bids 不能为空 / bids must be non-empty');
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
  const price = second === -Infinity ? 0 : second;
  hooks.onWinner?.(winnerIdx, price);
  const payoffs = bids.map((_, i) => (i === winnerIdx ? values[i]! - price : 0));
  payoffs.forEach((p, i) => hooks.onPayoff?.(i, p));
  return { winnerIdx, price, payoffs };
}
/** 单人中标的支付为 0（次高价=自身，退化情形按 0 处理）。 */
