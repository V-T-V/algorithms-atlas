// Burst Balloons · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'burst-balloons',
  categoryId: 'dp',
  title: { zh: '戳气球', en: 'Burst Balloons' },
  summary: {
    zh: '戳气球属于dp类别。',
    en: 'Burst Balloons is a dp algorithm.',
  },
  description: {
    zh: '戳气球（Burst Balloons）属于dp类别的算法。',
    en: 'Burst Balloons is an algorithm in the dp category.',
  },
  tags: ["dp"],
  complexity: { time: 'O(n³)', space: 'O(n²)' },
};
