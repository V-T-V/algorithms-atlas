// Red-Black Tree · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'red-black-tree',
  categoryId: 'tree',
  title: { zh: '红黑树', en: 'Red-Black Tree' },
  summary: {
    zh: '红黑树属于tree类别。',
    en: 'Red-Black Tree is a tree algorithm.',
  },
  description: {
    zh: '红黑树（Red-Black Tree）属于tree类别的算法。',
    en: 'Red-Black Tree is an algorithm in the tree category.',
  },
  tags: ["tree"],
  complexity: { time: 'O(log n)', space: 'O(log n)' },
};
