// Slope Trick · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'slope-trick',
  categoryId: 'dp',
  title: { zh: '斜率优化DP', en: 'Slope Trick' },
  summary: {
    zh: '斜率优化DP属于dp类别。',
    en: 'Slope Trick is a dp algorithm.',
  },
  description: {
    zh: '斜率优化DP（Slope Trick）属于dp类别的算法。',
    en: 'Slope Trick is an algorithm in the dp category.',
  },
  tags: ["dp"],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
