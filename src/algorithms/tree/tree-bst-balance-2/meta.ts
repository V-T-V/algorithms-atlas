// BST平衡因子 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'tree-bst-balance-2',
  categoryId: 'tree',
  title: { zh: 'BST平衡因子', en: 'BST Balance Factor' },
  summary: {
    zh: '计算每个节点平衡因子（左高-右高）。',
    en: 'Compute balance factor (left height - right height) per node.',
  },
  description: {
    zh: '后序返回高度，因子 = 左 - 右。',
    en: 'Post-order height; factor = L - R. O(n).',
  },
  tags: ['tree', 'balance-factor'],
  complexity: { time: 'O(n)', space: 'O(h)' },
};
