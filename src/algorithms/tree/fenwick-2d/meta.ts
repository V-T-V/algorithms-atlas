// 2D BIT · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'fenwick-2d',
  categoryId: 'tree',
  title: { zh: '二维树状数组', en: '2D BIT' },
  summary: {
    zh: '二维树状数组属于tree类别。',
    en: '2D BIT is a tree algorithm.',
  },
  description: {
    zh: '二维树状数组（2D BIT）属于tree类别的算法。',
    en: '2D BIT is an algorithm in the tree category.',
  },
  tags: ["tree","range-query"],
  complexity: { time: 'O(log R · log C)', space: 'O(R · C)' },
};
