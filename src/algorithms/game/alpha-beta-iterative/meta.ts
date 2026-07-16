// 迭代加深 Alpha-Beta（Iterative Deepening + Alpha-Beta）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'alpha-beta-iterative',
  categoryId: 'game',
  title: { zh: '迭代加深 + Alpha-Beta', en: 'Iterative Deepening + Alpha-Beta' },
  summary: {
    zh: '逐步加深搜索深度，每层用 alpha-beta 剪枝，配合置换表/最佳着法排序。',
    en: 'Gradually increase search depth, applying alpha-beta at each level with best-move ordering.',
  },
  description: {
    zh: '迭代加深（Iterative Deepening）配合 alpha-beta 剪枝：从深度 1 开始逐层加深到上限 D，每一层都重新跑一遍带剪枝的极小极大。看似重复搜索，但结合上一轮的最佳着法排序（先用 PV 路径）能让 alpha-beta 命中更多剪枝，整体效率反而更高；且能在任意时刻中断并返回当前最优着法（ anytime 算法）。\n\n本实现演示：对一棵博弈树（可按深度展开）从 d=1..D 反复搜索，记录每层的根效用值、最优着法与剪枝次数，观察「加深一层的剪枝率提升」。',
    en: "Iterative Deepening with alpha-beta: search depth 1, 2, ..., D, re-running alpha-beta at each level. Although this repeats work, using the previous iteration's best move for ordering triggers far more pruning at the next level — overall faster in practice. It is also an anytime algorithm: you can stop anytime and return the best move found so far.\n\nThis demo searches a game tree (expandable by depth) for d=1..D, recording root utility, best move and prune count per level, showing how pruning rate improves as depth increases.",
  },
  tags: ['game', 'alpha-beta', 'iterative-deepening', 'search'],
  complexity: { time: 'O(b^D)', space: 'O(D)' },
  references: [
    {
      label: 'Iterative Deepening',
      url: 'https://en.wikipedia.org/wiki/Iterative_deepening_depth-first_search',
    },
  ],
  defaultInput: { branching: 3, maxDepth: 4 },
};
