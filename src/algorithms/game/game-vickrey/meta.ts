// 维克里拍卖 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'game-vickrey',
  categoryId: 'game',
  title: { zh: '维克里拍卖', en: 'Vickrey Auction' },
  summary: {
    zh: '密封二价拍卖：最高出价者中标但付次高价，诚实出价是占优策略。',
    en: 'Sealed second-price auction: highest bidder wins but pays the second-highest bid; truthful bidding is dominant.',
  },
  description: {
    zh: '维克里拍卖（Vickrey 1961）：单物品、密封投标、最高出价中标、支付次高。在私人估值下，如实报自己的估值是（弱）占优策略，机制是激励相容的。',
    en: 'Vickrey auction (Vickrey 1961): single item, sealed bids, highest bidder wins, pays second-highest. With private values, truthful bidding is a (weakly) dominant strategy; the mechanism is incentive compatible.',
  },
  tags: ['game', 'auction', 'mechanism-design'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
