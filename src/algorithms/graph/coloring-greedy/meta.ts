import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'coloring-greedy',
  categoryId: 'graph',
  title: { zh: '贪心图着色', en: 'Greedy Coloring' },
  summary: {
    zh: 'Welsh-Powell：按度数降序，每点取最小可用颜色。',
    en: 'Welsh-Powell: order by degree desc, assign the smallest free color.',
  },
  description: {
    zh: '贪心图着色给图中每个顶点分配一种颜色，使相邻顶点不同色。Welsh-Powell 启发式将顶点按度数降序排列，依次为每个顶点选择邻居未使用的最小颜色编号。它不保证最优（最优着色是 NP-hard），但通常用色少且速度快。上界为 Δ+1（Δ 为最大度数）。时间 O(V² + E)。',
    en: 'Greedy coloring assigns each vertex a color distinct from its neighbors. The Welsh-Powell heuristic orders vertices by descending degree and picks the smallest color not used by any neighbor. It is not optimal (optimal coloring is NP-hard) but is fast and usually economical; the bound is Δ+1. Time O(V² + E).',
  },
  tags: ['graph', 'coloring', 'greedy', 'heuristic'],
  complexity: { time: 'O(V²+E)', space: 'O(V+E)' },
};
