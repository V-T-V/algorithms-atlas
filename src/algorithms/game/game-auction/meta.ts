// 拍卖博弈 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'game-auction',
  categoryId: 'game',
  title: { zh: '拍卖博弈（密封出价）', en: 'Auction Game (Sealed Bid)' },
  summary: {
    zh: '密封拍卖：多人出价，最高者得物并支付出价，分析各参与者收益。',
    en: "Sealed-bid auction: each bids, highest wins and pays the bid; analyze each player's payoff.",
  },
  description: {
    zh: '每位参与者有私人估值 vi，出价 bi。最高出价者获得物品，收益 = vi − bi；其余收益 0。平局取最早者。',
    en: 'Each player has private value vi and bids bi. The highest bidder wins, payoff vi-bi; others 0. Ties broken by earliest index.',
  },
  tags: ['game', 'auction', 'game-theory'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
