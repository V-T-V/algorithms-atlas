// 前序+中序重建v2 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'tree-build-preorder-2',
  categoryId: 'tree',
  title: { zh: '前序+中序重建v2', en: 'Build Tree from Pre+In v2' },
  summary: {
    zh: '由前序与中序遍历重建二叉树。',
    en: 'Rebuild a binary tree from preorder and inorder.',
  },
  description: {
    zh: '前序首元素是根，在中序里定位根，左右子树递归。',
    en: 'Root = pre[0]; split in-order around it. O(n).',
  },
  tags: ['tree', 'construct', 'preorder'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
