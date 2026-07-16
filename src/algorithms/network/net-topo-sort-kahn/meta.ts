// 拓扑排序Kahn · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'net-topo-sort-kahn',
  categoryId: 'network',
  title: { zh: '拓扑排序Kahn', en: 'Topological Sort (Kahn)' },
  summary: { zh: 'BFS 入度法对 DAG 拓扑排序。', en: 'Kahn BFS in-degree based topological sort.' },
  description: {
    zh: '统计入度，入度为 0 的入队，逐个剥离。',
    en: 'Peel zero-in-degree nodes. O(V+E).',
  },
  tags: ['network', 'graph', 'topological-sort'],
  complexity: { time: 'O(V+E)', space: 'O(V)' },
};
