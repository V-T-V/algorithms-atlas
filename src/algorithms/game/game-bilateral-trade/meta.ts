// 双边贸易机制（Bilateral Trade Mechanism）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'game-bilateral-trade',
  categoryId: 'game',
  title: { zh: '双边贸易机制', en: 'Bilateral Trade Mechanism' },
  summary: {
    zh: '买方估值 vs 卖方成本，求激励相容且个体理性的交易机制。',
    en: 'Buyer valuation vs seller cost; design incentive-compatible, individually rational trade mechanism.',
  },
  description: {
    zh: '双边贸易：买方估值 v，卖方成本 c。Myerson-Satterthwaite 表明一般无同时满足 IC/IR/预算平衡/高效的机制。计算固定价格机制效率。',
    en: 'Bilateral trade: buyer value v, seller cost c. Myerson-Satterthwaite shows no IC+IR+budget-balanced+efficient mechanism generally. Compute fixed-price efficiency.',
  },
  tags: ['game', 'mechanism-design', 'economics'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
