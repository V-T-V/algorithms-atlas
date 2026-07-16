// Count Occurrence · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'count-occurrence',
  categoryId: 'searching',
  title: { zh: '统计出现次数', en: 'Count Occurrence' },
  summary: {
    zh: '统计出现次数属于searching类别。',
    en: 'Count Occurrence is a searching algorithm.',
  },
  description: {
    zh: '统计出现次数（Count Occurrence）属于searching类别的算法。',
    en: 'Count Occurrence is an algorithm in the searching category.',
  },
  tags: ["searching","sorting"],
  complexity: { time: 'O(log n)', space: 'O(1)' },
};
