// 带移动排序的迭代加深 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ais-deepening-iterative-2',
  categoryId: 'ai-search',
  title: { zh: '带移动排序的迭代加深', en: 'Iterative Deepening with Move Ordering' },
  summary: {
    zh: 'IDDFS + 上一轮最佳移动优先排序，大幅提升 alpha-beta 剪枝效率。',
    en: 'IDDFS with best-move-first ordering from the previous iteration, greatly boosting alpha-beta pruning.',
  },
  description: {
    zh: '迭代加深（IDDFS）反复以 depth=1,2,...,D 运行深度受限搜索。带移动排序的变体：每轮记录每个节点处的最佳移动，下一轮以「上轮最佳移动优先」的顺序遍历子节点。这使 alpha-beta 剪枝更早发生（因剪枝在 best-first 时最强），实际展开节点数接近最优。本实现在数值博弈树上工作，使用 negamax + alpha-beta + 历史最佳移动表。',
    en: 'Iterative Deepening (IDDFS) repeatedly runs depth-limited search with depth=1,2,...,D. The move-ordering variant records the best move at each node per iteration and, in the next iteration, visits children ordered by "previous best first". This makes alpha-beta cutoffs happen earlier (pruning is strongest under best-first order), bringing the actual node count near optimal. This implementation works on numeric game trees using negamax + alpha-beta + a best-move history table.',
  },
  tags: ['ai-search', 'iterative-deepening', 'move-ordering', 'alpha-beta', 'negamax'],
  complexity: { time: 'O(b^d)', space: 'O(d)' },
};
