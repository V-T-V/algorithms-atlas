// DAG最长路径 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'net-longest-path-dag',
  categoryId: 'network',
  title: { zh: 'DAG最长路径', en: 'Longest Path in DAG' },
  summary: {
    zh: '拓扑排序+DP 求 DAG 最长路径长度。',
    en: 'Topo sort + DP for longest path in a DAG.',
  },
  description: {
    zh: '按拓扑序松弛 dist[v] = max(dist[v], dist[u]+w)。',
    en: 'Relax along topo order. O(V+E).',
  },
  tags: ['network', 'graph', 'dag'],
  complexity: { time: 'O(V+E)', space: 'O(V)' },
};
