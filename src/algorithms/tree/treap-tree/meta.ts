// Treap Tree · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'treap-tree',
  categoryId: 'tree',
  title: { zh: '树堆(树类)', en: 'Treap Tree' },
  summary: {
    zh: '树堆(树类)属于tree类别。',
    en: 'Treap Tree is a tree algorithm.',
  },
  description: {
    zh: '树堆(树类)（Treap Tree）属于tree类别的算法。',
    en: 'Treap Tree is an algorithm in the tree category.',
  },
  tags: ["tree"],
  complexity: { time: 'O(log n)', space: 'O(n)' },
};
