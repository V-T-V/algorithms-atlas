// 均值收益博弈（Mean Payoff Game）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'game-mean-payoff',
  categoryId: 'game',
  title: { zh: '均值收益博弈', en: 'Mean Payoff Game' },
  summary: {
    zh: '两人在图上推 token，最大化/最小化循环的平均权重，求值函数。',
    en: 'Two players push a token on a weighted graph, maximizing/minimizing cycle mean; compute the value.',
  },
  description: {
    zh: '均值收益博弈：图节点分属 Max/Min，沿边走并累加权重，无限 play 的平均收益为值。用 Karp 算法求最小/最大圈均值。',
    en: 'Mean payoff game: nodes belong to Max/Min; move along edges accumulating weights; value is the long-run average. Karp computes min/max cycle mean.',
  },
  tags: ['game', 'graph', 'minimax'],
  complexity: { time: 'O(n·m)', space: 'O(n²)' },
};
