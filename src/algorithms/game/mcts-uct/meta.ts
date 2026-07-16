// MCTS UCT · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'mcts-uct',
  categoryId: 'game',
  title: { zh: 'UCB搜索', en: 'MCTS UCT' },
  summary: {
    zh: 'UCB搜索属于game类别。',
    en: 'MCTS UCT is a game algorithm.',
  },
  description: {
    zh: 'UCB搜索（MCTS UCT）属于game类别的算法。',
    en: 'MCTS UCT is an algorithm in the game category.',
  },
  tags: ["game","mcts"],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
