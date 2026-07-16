import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ds-avl-impl',
  categoryId: 'ds',
  title: { zh: 'AVL 平衡树实现', en: 'AVL Tree Implementation' },
  summary: {
    zh: '插入与查找的 AVL 平衡二叉搜索树（节点带高度）。',
    en: 'AVL self-balancing BST with insert and search (height-tracked nodes).',
  },
  description: {
    zh: '插入后回溯更新高度，若平衡因子绝对值 >1 则 LL/LR/RL/RR 旋转修复。时间 O(log n)。',
    en: 'After insert, walk up updating height; if balance factor exceeds 1, rotate. O(log n).',
  },
  tags: ['ds', 'tree', 'avl', 'balanced'],
  complexity: { time: 'O(log n)', space: 'O(n)' },
};
