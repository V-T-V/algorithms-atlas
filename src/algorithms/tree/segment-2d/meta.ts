// 2D Segment · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'segment-2d',
  categoryId: 'tree',
  title: { zh: '二维线段树', en: '2D Segment' },
  summary: {
    zh: '二维线段树属于tree类别。',
    en: '2D Segment is a tree algorithm.',
  },
  description: {
    zh: '二维线段树（2D Segment）属于tree类别的算法。',
    en: '2D Segment is an algorithm in the tree category.',
  },
  tags: ["tree","range-query"],
  complexity: { time: 'O(?)', space: 'O(?)' },
};
