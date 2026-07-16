// 全付拍卖（All-Pay Auction）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'game-all-pay-auction',
  categoryId: 'game',
  title: { zh: '全付拍卖', en: 'All-Pay Auction' },
  summary: {
    zh: '所有竞标者都支付自己的报价，最高者得标，模型游说/R&D 竞赛。',
    en: 'Every bidder pays their bid; highest bid wins the prize; models lobbying and R&D races.',
  },
  description: {
    zh: '全付拍卖：n 个对称玩家估值 v，各报 b_i，最高者获奖 v，但所有人都支付 b_i。混合均衡存在。',
    en: 'All-pay auction: n symmetric bidders value v, each bids b_i; highest wins prize v but all pay their bid. Mixed equilibrium exists.',
  },
  tags: ['game', 'auction', 'mechanism-design'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
