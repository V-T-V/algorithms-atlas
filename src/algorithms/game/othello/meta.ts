// Othello Eval · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'othello',
  categoryId: 'game',
  title: { zh: '黑白棋评估', en: 'Othello Eval' },
  summary: {
    zh: '黑白棋评估属于game类别。',
    en: 'Othello Eval is a game algorithm.',
  },
  description: {
    zh: '黑白棋评估（Othello Eval）属于game类别的算法。',
    en: 'Othello Eval is an algorithm in the game category.',
  },
  tags: ["game"],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
