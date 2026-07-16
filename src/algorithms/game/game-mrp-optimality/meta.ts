// 马尔可夫奖励过程最优（Markov Reward Process Optimality）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'game-mrp-optimality',
  categoryId: 'game',
  title: { zh: '马尔可夫奖励过程最优', en: 'Markov Reward Process Optimality' },
  summary: {
    zh: '在 MRP 上贝尔曼方程求状态价值函数 V = R + γPV。',
    en: 'Bellman equation on an MRP: state values V = R + γPV via linear solve.',
  },
  description: {
    zh: '马尔可夫奖励过程：给定转移 P、奖励 R、折扣 γ，价值 V=(I-γP)^{-1}R。迭代法 V←R+γPV 收敛。',
    en: 'Markov reward process: given transition P, reward R, discount γ, value V=(I-γP)^{-1}R. Iterative V<-R+γPV converges.',
  },
  tags: ['game', 'mdp', 'dynamic-programming'],
  complexity: { time: 'O(k·n²)', space: 'O(n)' },
};
