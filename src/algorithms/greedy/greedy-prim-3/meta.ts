// Prim 最小生成树 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'greedy-prim-3',
  categoryId: 'greedy',
  title: { zh: 'Prim 最小生成树', en: 'Prim MST' },
  summary: {
    zh: '从一个起点出发，每次加入到已选集距离最小的边。',
    en: 'From a start vertex, repeatedly add the cheapest edge connecting the tree to a new vertex.',
  },
  description: {
    zh: 'Prim 算法：维护已选顶点集 S，反复选择 (S, V\\S) 之间权最小的边加入。简单实现 O(V²)。',
    en: 'Prim: maintain selected set S; repeatedly pick the cheapest edge crossing (S, V\\S). Simple O(V²).',
  },
  tags: ['greedy', 'graph', 'mst'],
  complexity: { time: 'O(V²)', space: 'O(V)' },
};
