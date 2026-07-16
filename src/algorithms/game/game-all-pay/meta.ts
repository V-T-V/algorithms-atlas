// 全付拍卖 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'game-all-pay',
  categoryId: 'game',
  title: { zh: '全付拍卖', en: 'All-Pay Auction' },
  summary: {
    zh: '所有竞拍者都付自己的出价，无论是否中标；常用于游说/竞赛建模。',
    en: 'All bidders pay their bid regardless of winning; models lobbying and contests.',
  },
  description: {
    zh: '全付拍卖：最高出价者中标，但每个人都付自己的出价（典型例子是政治游说、R&D 竞赛）。对称均衡下出价 = v^n × (n-1)/n 的期望（均匀估值）。',
    en: 'All-pay auction: highest bidder wins, but everyone pays their own bid (classic model for lobbying and R&D races). Symmetric equilibrium bid has closed form under uniform valuations.',
  },
  tags: ['game', 'auction', 'contest'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
