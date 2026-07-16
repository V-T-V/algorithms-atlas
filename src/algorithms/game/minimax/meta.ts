// Minimax · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'minimax',
  categoryId: 'game',
  title: { zh: '极小极大', en: 'Minimax' },
  summary: {
    zh: '极小极大属于game类别。',
    en: 'Minimax is a game algorithm.',
  },
  description: {
    zh: '极小极大（Minimax）属于game类别的算法。',
    en: 'Minimax is an algorithm in the game category.',
  },
  tags: ["game","game-theory"],
  complexity: { time: 'O(b^d)', space: 'O(d)' },
};
