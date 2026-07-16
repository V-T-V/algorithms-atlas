// Monte Carlo Tree Search · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'mcts',
  categoryId: 'ai-search',
  title: { zh: '蒙特卡洛树搜索', en: 'Monte Carlo Tree Search' },
  summary: {
    zh: '蒙特卡洛树搜索属于ai-search类别。',
    en: 'Monte Carlo Tree Search is a ai-search algorithm.',
  },
  description: {
    zh: '蒙特卡洛树搜索（Monte Carlo Tree Search）属于ai-search类别的算法。',
    en: 'Monte Carlo Tree Search is an algorithm in the ai-search category.',
  },
  tags: ["ai-search","mcts"],
  complexity: { time: 'O(迭代数 × 模拟长度)', space: 'O(树节点数)' },
};
