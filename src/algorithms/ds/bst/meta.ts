// Binary Search Tree · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'bst',
  categoryId: 'ds',
  title: { zh: '二叉搜索树', en: 'Binary Search Tree' },
  summary: {
    zh: '二叉搜索树属于ds类别。',
    en: 'Binary Search Tree is a ds algorithm.',
  },
  description: {
    zh: '二叉搜索树（Binary Search Tree）属于ds类别的算法。',
    en: 'Binary Search Tree is an algorithm in the ds category.',
  },
  tags: ["ds","tree"],
  complexity: { time: 'O(log n) 平均 / O(n) 最坏', space: 'O(n)' },
};
