// Knuth Optimization · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'knuth-dp',
  categoryId: 'dp',
  title: { zh: '四边形不等式DP', en: 'Knuth Optimization' },
  summary: {
    zh: '四边形不等式DP属于dp类别。',
    en: 'Knuth Optimization is a dp algorithm.',
  },
  description: {
    zh: '四边形不等式DP（Knuth Optimization）属于dp类别的算法。',
    en: 'Knuth Optimization is an algorithm in the dp category.',
  },
  tags: ["dp","dynamic-programming"],
  complexity: { time: 'O(n²)', space: 'O(n²)' },
};
