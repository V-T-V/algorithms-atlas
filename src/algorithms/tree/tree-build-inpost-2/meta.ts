// 中序+后序重建v2 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'tree-build-inpost-2',
  categoryId: 'tree',
  title: { zh: '中序+后序重建v2', en: 'Build Tree from In+Post v2' },
  summary: {
    zh: '由中序与后序遍历重建二叉树。',
    en: 'Rebuild a binary tree from inorder and postorder.',
  },
  description: { zh: '后序末元素是根。', en: 'Root = post[last]; split in-order. O(n).' },
  tags: ['tree', 'construct', 'postorder'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
