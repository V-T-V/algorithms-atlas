// 矩形分配问题 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'net-assignment-rectangular',
  categoryId: 'network',
  title: { zh: '矩形分配问题', en: 'Rectangular Assignment Problem' },
  summary: {
    zh: '在 m×n（m≠n）代价矩阵上求最小代价分配，用零代价虚拟行/列补成方阵。',
    en: 'Solve minimum-cost assignment on an m×n (m!=n) cost matrix by padding with zero-cost dummy rows or columns into a square.',
  },
  description: {
    zh: '矩形分配：m 个工人、n 个任务（m≠n），代价矩阵非方阵。归约：将矩阵补成 max(m,n)×max(m,n) 方阵，补出的虚拟行/列代价设为 0，然后求完全分配。多余的虚拟分配在实际中丢弃，得到 min(m,n) 个真实配对。',
    en: 'Rectangular assignment: m workers, n tasks (m!=n); the cost matrix is non-square. Reduction: pad to max(m,n)×max(m,n) with zero-cost dummy rows/columns, then solve complete assignment. Dummy pairings are discarded, yielding min(m,n) real pairs.',
  },
  tags: ['network', 'assignment', 'rectangular', 'min-cost-flow', 'unbalanced'],
  complexity: { time: 'O(max(m,n)³)', space: 'O(max(m,n)²)' },
};
