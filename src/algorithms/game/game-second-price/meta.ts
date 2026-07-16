// 第二价格拍卖 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'game-second-price',
  categoryId: 'game',
  title: { zh: '第二价格拍卖', en: 'Second-Price Auction' },
  summary: {
    zh: '最高出价中标、付次高价；占优策略是诚实出价。',
    en: 'Highest bid wins and pays the second-highest; truthful bidding is dominant.',
  },
  description: {
    zh: '第二价格密封拍卖（与维克里拍卖同义）。在独立私人估值 (IPV) 下，诚实出价是（弱）占优策略，使分配有效率。',
    en: 'Second-price sealed-bid auction (synonymous with Vickrey). Under independent private values, truthful bidding is a (weakly) dominant strategy and the allocation is efficient.',
  },
  tags: ['game', 'auction'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
