// Monte Carlo Pi · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'monte-carlo-pi',
  categoryId: 'randomized',
  title: { zh: '蒙特卡洛求 π', en: 'Monte Carlo Pi' },
  summary: {
    zh: '蒙特卡洛求 π属于randomized类别。',
    en: 'Monte Carlo Pi is a randomized algorithm.',
  },
  description: {
    zh: '蒙特卡洛求 π（Monte Carlo Pi）属于randomized类别的算法。',
    en: 'Monte Carlo Pi is an algorithm in the randomized category.',
  },
  tags: ["randomized","mcts"],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
