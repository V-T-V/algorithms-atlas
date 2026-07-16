// Mergeable Segment · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'merge-segment',
  categoryId: 'tree',
  title: { zh: '可合并线段树', en: 'Mergeable Segment' },
  summary: {
    zh: '可合并线段树属于tree类别。',
    en: 'Mergeable Segment is a tree algorithm.',
  },
  description: {
    zh: '可合并线段树（Mergeable Segment）属于tree类别的算法。',
    en: 'Mergeable Segment is an algorithm in the tree category.',
  },
  tags: ["tree","range-query","sorting"],
  complexity: { time: 'O(log M) / O(overlap)', space: 'O(n log M)' },
};
