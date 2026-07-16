// 层序遍历v2 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'tree-levelorder-2',
  categoryId: 'tree',
  title: { zh: '层序遍历v2', en: 'Level Order Traversal v2' },
  summary: { zh: 'BFS 按层自上而下遍历二叉树。', en: 'BFS level-by-level traversal.' },
  description: {
    zh: '队列驱动：每弹出一个节点，把其值入列，再把非空子节点入队。',
    en: 'Queue-driven BFS. O(n), O(w).',
  },
  tags: ['tree', 'traversal', 'bfs'],
  complexity: { time: 'O(n)', space: 'O(w)' },
};
