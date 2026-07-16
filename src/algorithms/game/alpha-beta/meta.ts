// Alpha-Beta Pruning · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'alpha-beta',
  categoryId: 'game',
  title: { zh: 'Alpha-Beta 剪枝', en: 'Alpha-Beta Pruning' },
  summary: {
    zh: 'Alpha-Beta 剪枝属于game类别。',
    en: 'Alpha-Beta Pruning is a game algorithm.',
  },
  description: {
    zh: 'Alpha-Beta 剪枝（Alpha-Beta Pruning）属于game类别的算法。',
    en: 'Alpha-Beta Pruning is an algorithm in the game category.',
  },
  tags: ["game","game-theory"],
  complexity: { time: 'O(b^(d/2)) best', space: 'O(d)' },
};
