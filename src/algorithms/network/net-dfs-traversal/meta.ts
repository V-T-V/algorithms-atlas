// 图DFS遍历 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'net-dfs-traversal',
  categoryId: 'network',
  title: { zh: '图DFS遍历', en: 'Graph DFS Traversal' },
  summary: { zh: '邻接表上递归 DFS，记录访问顺序。', en: 'Recursive DFS on an adjacency list.' },
  description: {
    zh: '从起点出发，标记访问，递归邻居。',
    en: 'Mark visited, recurse neighbors. O(V+E).',
  },
  tags: ['network', 'graph', 'dfs'],
  complexity: { time: 'O(V+E)', space: 'O(V)' },
};
