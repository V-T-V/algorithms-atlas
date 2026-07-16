// Expectiminimax · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'expectiminimax',
  categoryId: 'game',
  title: { zh: '期望极小极大', en: 'Expectiminimax' },
  summary: {
    zh: '期望极小极大属于game类别。',
    en: 'Expectiminimax is a game algorithm.',
  },
  description: {
    zh: '期望极小极大（Expectiminimax）属于game类别的算法。',
    en: 'Expectiminimax is an algorithm in the game category.',
  },
  tags: ["game","game-theory"],
  complexity: { time: 'O(b^d)', space: 'O(d)' },
};
