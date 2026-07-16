import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'graph-welsh-powell',
  categoryId: 'graph',
  title: { zh: 'Welsh-Powell 着色', en: 'Welsh-Powell Coloring' },
  summary: {
    zh: '按度数降序贪心着色，给出上界 Δ+1 以内的着色。',
    en: 'Greedy coloring by descending degree; yields a coloring within Δ+1.',
  },
  description: {
    zh: 'Welsh-Powell 启发式图着色。将节点按度数从大到小排序，依次为每个节点分配「最小的、未被邻居占用的颜色」。虽不保证最优色数，但实践效果好且是上界 Δ+1 内的经典启发。时间 O(V²)（朴素查邻居颜色），空间 O(V)。',
    en: 'Welsh-Powell greedy graph coloring: sort vertices by descending degree, assign each the smallest color unused by neighbors. Heuristic within Δ+1. Time O(V²), space O(V).',
  },
  tags: ['graph', 'coloring', 'greedy'],
  complexity: { time: 'O(V²)', space: 'O(V)' },
};
