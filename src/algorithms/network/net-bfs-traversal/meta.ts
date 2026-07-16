// 图BFS遍历 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'net-bfs-traversal',
  categoryId: 'network',
  title: { zh: '图BFS遍历', en: 'Graph BFS Traversal' },
  summary: { zh: '邻接表上 BFS，记录访问顺序与层。', en: 'BFS on adjacency list with levels.' },
  description: { zh: '队列驱动，逐层访问。', en: 'Queue-driven, level by level. O(V+E).' },
  tags: ['network', 'graph', 'bfs'],
  complexity: { time: 'O(V+E)', space: 'O(V)' },
};
