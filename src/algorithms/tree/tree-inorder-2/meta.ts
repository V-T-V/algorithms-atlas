// 中序遍历v2 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'tree-inorder-2',
  categoryId: 'tree',
  title: { zh: '中序遍历v2', en: 'Inorder Traversal v2' },
  summary: { zh: '递归中序遍历：左→根→右。', en: 'Recursive inorder: left, root, right.' },
  description: {
    zh: '递归左子树，访问根，递归右子树。BST 中序得升序。',
    en: 'Recurse left, visit root, recurse right. O(n).',
  },
  tags: ['tree', 'traversal', 'inorder'],
  complexity: { time: 'O(n)', space: 'O(h)' },
};
