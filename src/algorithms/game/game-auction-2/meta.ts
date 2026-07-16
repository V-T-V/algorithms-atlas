// 拍卖博弈框架 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'game-auction-2',
  categoryId: 'game',
  title: { zh: '拍卖博弈框架', en: 'Auction Game Framework' },
  summary: {
    zh: '对密封投标拍卖模拟：给定估值与出价，决定中标者与支付。',
    en: 'Simulate a sealed-bid auction: given valuations and bids, decide the winner and the payment.',
  },
  description: {
    zh: '统一框架：参数 type ∈ {first-price, second-price, all-pay}，bid[i] 为玩家 i 的出价，value[i] 为其估值。最高出价者中标；支付规则按 type 计算。',
    en: 'Unified framework: type ∈ {first-price, second-price, all-pay}; bid[i] and value[i] per player. Highest bidder wins; payment follows the rule indicated by type.',
  },
  tags: ['game', 'auction', 'game-theory'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
