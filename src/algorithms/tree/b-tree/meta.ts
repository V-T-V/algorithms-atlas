// B-Tree · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'b-tree',
  categoryId: 'tree',
  title: { zh: 'B 树', en: 'B-Tree' },
  summary: {
    zh: 'B 树属于tree类别。',
    en: 'B-Tree is a tree algorithm.',
  },
  description: {
    zh: 'B 树（B-Tree）属于tree类别的算法。',
    en: 'B-Tree is an algorithm in the tree category.',
  },
  tags: ["tree"],
  complexity: { time: 'O(log n)', space: 'O(n)' },
};
