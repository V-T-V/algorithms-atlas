// LIS Segment · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'lis-segment',
  categoryId: 'dp',
  title: { zh: 'LIS线段树', en: 'LIS Segment' },
  summary: {
    zh: 'LIS线段树属于dp类别。',
    en: 'LIS Segment is a dp algorithm.',
  },
  description: {
    zh: 'LIS线段树（LIS Segment）属于dp类别的算法。',
    en: 'LIS Segment is an algorithm in the dp category.',
  },
  tags: ["dp","range-query","dynamic-programming"],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
