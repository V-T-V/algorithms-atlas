// 深度优先分支定界（Depth-First Branch and Bound）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'ais-dfbb-search',
  categoryId: 'ai-search',
  title: { zh: '深度优先分支定界', en: 'Depth-First Branch and Bound' },
  summary: { zh: 'DFS 配合上界剪枝求最优。', en: 'DFS with bound pruning for optimum.' },
  description: {
    zh: 'DFB&B 用深度优先遍历解空间树，过程中维护当前最优解代价，剪掉代价超过最优的分支，内存为 O(n)。',
    en: 'DFB&B traverses the solution tree depth-first, keeping the incumbent cost and pruning branches that exceed it; uses O(n) memory.',
  },
  tags: ['ai-search', 'dfbb', 'optimization'],
  complexity: { time: 'O(2^n)', space: 'O(n)' },
};
