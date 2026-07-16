// Negamax 搜索 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'negamax',
  categoryId: 'ai-search',
  title: { zh: 'Negamax 搜索', en: 'Negamax Search' },
  summary: {
    zh: '统一视角的 minimax：每个节点都取 max(−child)，依赖零和性质。',
    en: 'A unified form of minimax: every node takes max(−child), relying on the zero-sum property.',
  },
  description: {
    zh: 'Negamax 是 minimax 的优雅变体。核心观察：在零和博弈中，一方的最好 = 另一方的最坏的相反数。因此每个节点都按「当前玩家」视角递归求 max(−child)，代码只需一个分支。本实现以 Tic-Tac-Toe（井字棋）为演示：3×3 棋盘，先连成三子者胜。+1/-1/0 分别表示当前玩家胜/负/平。',
    en: "Negamax is an elegant minimax variant. Key insight: in a zero-sum game, one side's best is the negative of the other's best, so every node recurses as max(−child) from the side-to-move's viewpoint, needing only one branch. This implementation demonstrates on Tic-Tac-Toe (3×3, first to line up three wins). +1/-1/0 mean win/loss/draw for the side to move.",
  },
  tags: ['ai-search', 'game-tree', 'zero-sum', 'recursive'],
  complexity: { time: 'O(b^d)', space: 'O(d)' },
  references: [
    {
      label: 'Negamax — Wikipedia',
      url: 'https://en.wikipedia.org/wiki/Negamax',
    },
  ],
};
