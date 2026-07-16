// Search For a Range · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'search-range',
  categoryId: 'searching',
  title: { zh: '查找区间', en: 'Search For a Range' },
  summary: {
    zh: '查找区间属于searching类别。',
    en: 'Search For a Range is a searching algorithm.',
  },
  description: {
    zh: '查找区间（Search For a Range）属于searching类别的算法。',
    en: 'Search For a Range is an algorithm in the searching category.',
  },
  tags: ["searching"],
  complexity: { time: 'O(log n)', space: 'O(1)' },
};
