import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'graph-kruskal-3',
  categoryId: 'graph',
  title: { zh: 'Kruskal 最小生成树（并查集）', en: 'Kruskal MST (Union-Find)' },
  summary: {
    zh: '将边按权升序排序，逐条尝试加入，用并查集判环。',
    en: 'Sort edges ascending; add each if its endpoints are in different components (union-find).',
  },
  description: {
    zh: '排序所有边 O(E log E)。维护并查集，若边两端点不在同一集合则加入 MST 并合并。直到加入 V-1 条边。',
    en: 'Sort edges; maintain union-find; add edge if endpoints differ in component. Stop at V-1 edges.',
  },
  tags: ['graph', 'mst', 'union-find', 'greedy'],
  complexity: { time: 'O(E log E)', space: 'O(V)' },
};
