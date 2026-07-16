// 多臂老虎机 UCB（Multi-Armed Bandit UCB）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'game-bandit-ucb',
  categoryId: 'game',
  title: { zh: '多臂老虎机 UCB', en: 'Multi-Armed Bandit UCB' },
  summary: {
    zh: 'UCB1：以置信上界选臂，平衡探索与利用，regret 为 O(log n)。',
    en: 'UCB1 picks arms by upper confidence bound, balancing explore/exploit with O(log n) regret.',
  },
  description: {
    zh: '多臂老虎机：每臂未知收益分布。UCB1 = 均值 + sqrt(2 ln t / n_i)，选最大者。理论 regret 上界 O(log n)。',
    en: 'Multi-armed bandit: each arm has unknown payoff. UCB1 = mean + sqrt(2 ln t / n_i); pick the max. Regret bound O(log n).',
  },
  tags: ['game', 'bandit', 'reinforcement-learning'],
  complexity: { time: 'O(k) per step', space: 'O(k)' },
};
