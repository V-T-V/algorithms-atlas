// LIS nlogn · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'lis-nlog',
  categoryId: 'dp',
  title: { zh: 'LIS二分', en: 'LIS nlogn' },
  summary: {
    zh: 'LIS二分属于dp类别。',
    en: 'LIS nlogn is a dp algorithm.',
  },
  description: {
    zh: 'LIS二分（LIS nlogn）属于dp类别的算法。',
    en: 'LIS nlogn is an algorithm in the dp category.',
  },
  tags: ["dp","dynamic-programming"],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
