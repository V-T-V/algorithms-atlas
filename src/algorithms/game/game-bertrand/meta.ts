// 伯特兰寡头博弈（Bertrand Duopoly）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'game-bertrand',
  categoryId: 'game',
  title: { zh: '伯特兰寡头博弈', en: 'Bertrand Duopoly' },
  summary: {
    zh: '两厂商同时定价，低价者获全部市场，均衡价格等于边际成本。',
    en: 'Two firms set prices; the lower price captures all demand; equilibrium price equals marginal cost.',
  },
  description: {
    zh: '伯特兰：两厂商同质产品，定价 p1,p2，低价者获全部需求 D(p)，等价则平分。均衡 p1=p2=c（边际成本）。',
    en: 'Bertrand: homogeneous goods, prices p1,p2; lower price wins all demand D(p); tie splits. Equilibrium p1=p2=c (marginal cost).',
  },
  tags: ['game', 'economics', 'oligopoly'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
