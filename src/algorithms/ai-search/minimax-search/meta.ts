// 极小化极大搜索 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'minimax-search',
  categoryId: 'ai-search',
  title: { zh: '极小化极大搜索', en: 'Minimax Search' },
  summary: {
    zh: '零和博弈中双方都最优应对时，递归求出根节点的博弈值。',
    en: 'Recursively computes the game value of a node under optimal play by both sides.',
  },
  description: {
    zh: '极小化极大（Minimax）是双人零和博弈的基础搜索算法。MAX 方在自己回合选择使局面值最大的走法，MIN 方在对手回合选择使局面值最小的走法，递归到叶子（终局或深度限制）后用启发式估值。本实现以 Nim 取石子为演示：轮流从一堆中取至少 1 颗，取到最后一颗者胜。结果为正表示当前玩家必胜。',
    en: 'Minimax is the foundational search algorithm for two-player zero-sum games. On its turn, MAX picks the move maximizing the position value; MIN picks the move minimizing it. Leaves are scored by a heuristic or terminal test. This implementation demonstrates on Nim: players alternately remove stones from a heap, taking the last stone wins. A positive value means the side to move wins.',
  },
  tags: ['ai-search', 'game-tree', 'zero-sum', 'recursive'],
  complexity: { time: 'O(b^d)', space: 'O(d)' },
  references: [
    {
      label: 'Minimax — Wikipedia',
      url: 'https://en.wikipedia.org/wiki/Minimax',
    },
  ],
};
