// 二叉树直径v2 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'tree-diameter-2',
  categoryId: 'tree',
  title: { zh: '二叉树直径v2', en: 'Tree Diameter v2' },
  summary: {
    zh: '求二叉树中任意两节点路径上的最大边数。',
    en: 'Longest path (in edges) between any two nodes.',
  },
  description: {
    zh: '后序递归：diameter = max(leftH + rightH)，高度同时返回。',
    en: 'Post-order: update ans with leftH+rightH. O(n).',
  },
  tags: ['tree', 'diameter', 'dfs'],
  complexity: { time: 'O(n)', space: 'O(h)' },
};
