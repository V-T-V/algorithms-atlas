// BFS根到节点路径 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'tree-bfs-path-2',
  categoryId: 'tree',
  title: { zh: 'BFS根到节点路径', en: 'Path from Root to Node' },
  summary: {
    zh: '给定目标值，找从根到该节点的路径。',
    en: 'Find the path from root to the node with a given value.',
  },
  description: { zh: 'DFS 记录路径，命中时返回。', en: 'DFS tracking path; return on hit. O(n).' },
  tags: ['tree', 'path', 'dfs'],
  complexity: { time: 'O(n)', space: 'O(h)' },
};
