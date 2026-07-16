// 迭代加深搜索 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'iterative-deepening',
  categoryId: 'ai-search',
  title: { zh: '迭代加深搜索 (IDDFS)', en: 'Iterative Deepening DFS' },
  summary: {
    zh: '逐步加深深度上限的 DFS，兼顾 BFS 的最优性与 DFS 的低内存。',
    en: 'Repeatedly deeper DFS that combines BFS optimality with DFS low memory.',
  },
  description: {
    zh: '迭代加深（IDDFS）反复以深度 1, 2, 3, … 调用受限 DFS，直到找到目标或达到上限。看似重复浪费，但由于每层节点数为指数增长，最深一层的开销远大于之前所有层之和，总开销与单次 BFS 同阶，却只用 O(d) 内存。在博弈搜索中它常与 alpha-beta/negamax 结合：每层搜索得到一个最佳值与走法，作为下一层窗口与排序的输入，并支持「时间到了就停」。本实现用带 utility 的数值博弈树，每层用 negamax 求值并记录最佳走法。',
    en: 'Iterative Deepening (IDDFS) repeatedly calls a depth-limited DFS at 1, 2, 3, ... until the target is found or the cap is hit. The repeated work looks wasteful, but because tree size grows exponentially, the final level dominates and the total cost is on the order of a single BFS while using only O(d) memory. In game search it pairs with alpha-beta/negamax: each level yields a best value and move used as the next level\'s window and ordering, and supports "stop on time". This implementation works on a numeric game tree, using negamax per level and tracking the best move.',
  },
  tags: ['ai-search', 'game-tree', 'depth-limited', 'time-bounded'],
  complexity: { time: 'O(b^d)', space: 'O(b·d)' },
  references: [
    {
      label: 'Iterative deepening depth-first search — Wikipedia',
      url: 'https://en.wikipedia.org/wiki/Iterative_deepening_depth-first_search',
    },
  ],
};
