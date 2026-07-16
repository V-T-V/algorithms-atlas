import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'graph-idastar',
  categoryId: 'graph',
  title: { zh: 'IDA* 迭代加深 A*', en: 'IDA* Iterative Deepening A*' },
  summary: {
    zh: '以启发式 f 为阈值迭代加深深度优先搜索，空间极省。',
    en: 'Iteratively deepen DFS bounded by heuristic f-threshold; minimal memory.',
  },
  description: {
    zh: 'IDA*（Iterative Deepening A*）。结合迭代加深与启发函数 f=g+h：每轮以上一轮的最小「越界 f」为新阈值，DFS 中 f 超过阈值即剪枝回溯。当找到目标时即为最优（启发 admissible）。无优先队列，空间 O(d)（d=解深度）。适合启发差异大、内存受限的场景（如十五数码）。时间 O(b^d)，空间 O(d)。',
    en: 'IDA* combines iterative deepening with f=g+h bound. Each iteration uses the smallest exceeded f as new threshold; prune when f>threshold. Memory O(depth). Time O(b^d), space O(d).',
  },
  tags: ['graph', 'search', 'astar', 'dfs', 'heuristic'],
  complexity: { time: 'O(b^d)', space: 'O(d)' },
};
