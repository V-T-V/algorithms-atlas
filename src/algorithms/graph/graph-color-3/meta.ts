import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'graph-color-3',
  categoryId: 'graph',
  title: { zh: '图着色（贪心）', en: 'Graph Coloring (Greedy)' },
  summary: {
    zh: '按节点顺序贪心染最小可用色，相邻不同色。',
    en: 'Color each vertex with the smallest color not used by its neighbors.',
  },
  description: {
    zh: 'Welsh-Powell 风格贪心：遍历每个顶点 v，找其邻居未使用的最小正整数色染之。结果色数 ≤ Δ+1。',
    en: 'Greedy: for each vertex pick the smallest positive integer not used by any neighbor. ≤ Δ+1 colors.',
  },
  tags: ['graph', 'coloring', 'greedy'],
  complexity: { time: 'O(V² + E)', space: 'O(V)' },
};
