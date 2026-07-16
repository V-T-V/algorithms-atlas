// 夏普利值（Shapley Value）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'game-shapley-value',
  categoryId: 'game',
  title: { zh: '夏普利值', en: 'Shapley Value' },
  summary: {
    zh: '合作博弈中按边际贡献加权的公平分配，满足对称/无效玩家/加性公理。',
    en: 'Cooperative game fair share weighted by marginal contribution; satisfies symmetry/dummy/additivity.',
  },
  description: {
    zh: '夏普利值 φ_i = Σ_S [|S|!(n-|S|-1)!/n!] · [v(S∪{i})-v(S)]。是唯一满足效率、对称、dummy、加性公理的分配。',
    en: 'Shapley value φ_i = Σ_S [|S|!(n-|S|-1)!/n!] · [v(S∪{i})-v(S)]. Unique efficient+symmetric+dummy+additive allocation.',
  },
  tags: ['game', 'cooperative', 'fairness'],
  complexity: { time: 'O(2ⁿ·n)', space: 'O(2ⁿ)' },
};
