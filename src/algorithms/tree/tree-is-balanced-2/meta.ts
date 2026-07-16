// 平衡判断v2 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'tree-is-balanced-2',
  categoryId: 'tree',
  title: { zh: '平衡判断v2', en: 'Is Balanced v2' },
  summary: {
    zh: '判断二叉树是否高度平衡（左右子树高差≤1）。',
    en: 'Check if a binary tree is height-balanced.',
  },
  description: {
    zh: '递归返回高度，发现不平衡返回 -1 提前剪枝。',
    en: 'Return -1 when unbalanced, else height. O(n).',
  },
  tags: ['tree', 'balanced', 'dfs'],
  complexity: { time: 'O(n)', space: 'O(h)' },
};
