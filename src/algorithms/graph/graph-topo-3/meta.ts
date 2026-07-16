import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'graph-topo-3',
  categoryId: 'graph',
  title: { zh: '拓扑排序（Kahn 入度法）', en: 'Topological Sort (Kahn)' },
  summary: {
    zh: '反复选入度为 0 的节点并删除其出边，得到有向图的拓扑序。',
    en: 'Repeatedly remove zero-indegree vertices to produce a topological order.',
  },
  description: {
    zh: 'Kahn 算法：维护入度表。每次取出入度 0 的节点加入结果，并对其邻居入度 -1。若结果数 < n 则存在环。',
    en: 'Kahn: maintain indegree; remove zero-indegree vertices and decrement neighbors. If output < n, a cycle exists.',
  },
  tags: ['graph', 'topological-sort', 'dag'],
  complexity: { time: 'O(V+E)', space: 'O(V)' },
};
