// Bloom Filter · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'bloom-filter',
  categoryId: 'ds',
  title: { zh: '布隆过滤器', en: 'Bloom Filter' },
  summary: {
    zh: '布隆过滤器属于ds类别。',
    en: 'Bloom Filter is a ds algorithm.',
  },
  description: {
    zh: '布隆过滤器（Bloom Filter）属于ds类别的算法。',
    en: 'Bloom Filter is an algorithm in the ds category.',
  },
  tags: ["ds"],
  complexity: { time: 'O(k) 增查', space: 'O(m) 位' },
};
