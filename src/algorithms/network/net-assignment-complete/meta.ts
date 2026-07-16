// 完全分配问题 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'net-assignment-complete',
  categoryId: 'network',
  title: { zh: '完全分配问题 (方阵)', en: 'Complete Assignment Problem' },
  summary: {
    zh: '在 n×n 代价方阵上求一一对应的最小总代价分配，归约为最小费用最大流。',
    en: 'Solve the minimum-cost one-to-one assignment on an n×n cost matrix via reduction to min-cost max flow.',
  },
  description: {
    zh: '完全分配（平衡指派）：n 个工人、n 个任务，代价方阵 C[i][j]，求一一对应使总代价最小。归约：超级源 S 连工人 i（容 1，费 0），工人 i 连任务 j（容 1，费 C[i][j]），任务 j 连超级汇 T（容 1，费 0）。最小费用最大流的流量恰为 n，费用即最小总代价。',
    en: 'Complete (balanced) assignment: n workers, n tasks, cost matrix C[i][j]; find a bijection minimizing total cost. Reduction: super-source S to worker i (cap 1, cost 0), worker i to task j (cap 1, cost C[i][j]), task j to super-sink T (cap 1, cost 0). The min-cost max flow saturates to n units; its cost is the optimum.',
  },
  tags: ['network', 'assignment', 'min-cost-flow', 'bipartite', 'optimization'],
  complexity: { time: 'O(n³)', space: 'O(n²)' },
};
