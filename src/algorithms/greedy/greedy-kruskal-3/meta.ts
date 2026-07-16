// Kruskal 最小生成树 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'greedy-kruskal-3',
  categoryId: 'greedy',
  title: { zh: 'Kruskal 最小生成树', en: 'Kruskal MST' },
  summary: {
    zh: '按边权升序加入不形成环的边，直到生成树完成。',
    en: 'Sort edges by weight ascending; add edges that do not create a cycle until the spanning tree is complete.',
  },
  description: {
    zh: 'Kruskal 算法：把所有边按权升序排列，依次尝试加入，用并查集判断是否成环。时间 O(E log E)。',
    en: 'Kruskal: sort all edges by weight ascending, try adding each; union-find detects cycles. Time O(E log E).',
  },
  tags: ['greedy', 'graph', 'mst'],
  complexity: { time: 'O(E log E)', space: 'O(V)' },
};
