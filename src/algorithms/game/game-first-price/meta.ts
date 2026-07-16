// 第一价格密封拍卖 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'game-first-price',
  categoryId: 'game',
  title: { zh: '第一价格密封拍卖', en: 'First-Price Sealed-Bid Auction' },
  summary: {
    zh: '最高出价者中标并付自己的出价；理性出价需低于估值（bid shading）。',
    en: 'Highest bidder wins and pays their own bid; rational bidding is below valuation (bid shading).',
  },
  description: {
    zh: '第一价格密封拍卖：中标者付最高价（自己的出价）。纳什均衡下，出价 = 估值 × (n-1)/n（n 个对称风险中性竞拍者、均匀估值）。',
    en: 'First-price sealed-bid: winner pays the top bid. Nash equilibrium bid = valuation × (n-1)/n for n symmetric risk-neutral bidders with uniform valuations.',
  },
  tags: ['game', 'auction'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
