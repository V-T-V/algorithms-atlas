import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ds-treap-2',
  categoryId: 'ds',
  title: { zh: 'Treap（树堆）', en: 'Treap' },
  summary: {
    zh: 'BST + 堆，随机优先级维持平衡，期望深度 O(log n)。',
    en: 'BST + heap; random priorities keep the tree balanced, expected depth O(log n).',
  },
  description: {
    zh: '键满足二叉搜索树性质，优先级满足堆性质。插入/删除通过旋转维护。',
    en: 'Keys respect BST order; priorities respect heap order. Insert/delete via rotations.',
  },
  tags: ['ds', 'treap', 'bst', 'balanced-tree'],
  complexity: { time: 'O(log n)', space: 'O(n)' },
};
