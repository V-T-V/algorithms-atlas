import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'graph-dsatur',
  categoryId: 'graph',
  title: { zh: 'DSATUR 着色', en: 'DSATUR Coloring' },
  summary: {
    zh: '动态选「邻居已用色最多」的节点着色，启发式接近最优。',
    en: 'Repeatedly color the vertex whose neighbors use the most distinct colors (saturation).',
  },
  description: {
    zh: 'DSATUR（Degree of SATURation）图着色启发。每步选取「饱和度」（邻居已使用的不同颜色数）最大的未着色节点；并列时取度数最大者；再分配最小可用颜色。相比 Welsh-Powell 的静态排序，DSATUR 动态更新饱和度，通常用色更少。时间 O(V²)，空间 O(V)。',
    en: 'DSATUR: pick uncolored vertex with highest saturation (distinct neighbor colors), tie by degree, assign smallest available color. Dynamic. Time O(V²), space O(V).',
  },
  tags: ['graph', 'coloring', 'greedy', 'heuristic'],
  complexity: { time: 'O(V²)', space: 'O(V)' },
};
