// Chairman Tree · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'chairman-tree',
  categoryId: 'tree',
  title: { zh: '主席树', en: 'Chairman Tree' },
  summary: {
    zh: '主席树属于tree类别。',
    en: 'Chairman Tree is a tree algorithm.',
  },
  description: {
    zh: '主席树（Chairman Tree）属于tree类别的算法。',
    en: 'Chairman Tree is an algorithm in the tree category.',
  },
  tags: ["tree"],
  complexity: { time: 'O(n log m)', space: 'O(n log m)' },
};
