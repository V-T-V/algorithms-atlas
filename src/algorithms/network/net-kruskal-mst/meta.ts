// Kruskal最小生成树 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'net-kruskal-mst',
  categoryId: 'network',
  title: { zh: 'Kruskal最小生成树', en: 'Kruskal MST' },
  summary: {
    zh: '按边权排序 + 并查集构造 MST。',
    en: 'Sort edges by weight, union-find to build MST.',
  },
  description: {
    zh: '边按权排序，用并查集判环，依次加入。',
    en: 'Sort edges, union-find, add if no cycle. O(E log E).',
  },
  tags: ['network', 'graph', 'mst'],
  complexity: { time: 'O(E log E)', space: 'O(V)' },
};
