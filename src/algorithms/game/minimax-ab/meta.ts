// Minimax AB · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'minimax-ab',
  categoryId: 'game',
  title: { zh: '极小极大AB剪枝', en: 'Minimax AB' },
  summary: {
    zh: '极小极大AB剪枝属于game类别。',
    en: 'Minimax AB is a game algorithm.',
  },
  description: {
    zh: '极小极大AB剪枝（Minimax AB）属于game类别的算法。',
    en: 'Minimax AB is an algorithm in the game category.',
  },
  tags: ["game","game-theory"],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
