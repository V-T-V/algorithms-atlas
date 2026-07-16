// 贝叶斯纳什均衡（Bayesian Nash Equilibrium）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'game-bayesian-nash',
  categoryId: 'game',
  title: { zh: '贝叶斯纳什均衡', en: 'Bayesian Nash Equilibrium' },
  summary: {
    zh: '不完全信息博弈中，每人按类型依策略最大化期望收益。',
    en: 'In games of incomplete info, each type plays the strategy maximizing expected payoff.',
  },
  description: {
    zh: '贝叶斯纳什：每个玩家有类型分布，选择类型依策略使期望收益最大（给定他人策略）。一阶价格拍卖的均衡为均匀分布。',
    en: 'Bayesian Nash: each player has a type distribution and picks a type-contingent strategy maximizing expected payoff. First-price auction BNE is uniform shading.',
  },
  tags: ['game', 'game-theory', 'bayesian'],
  complexity: { time: 'O(n²)', space: 'O(n)' },
};
