// Aho Search · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'aho',
  categoryId: 'string',
  title: { zh: 'Aho搜索', en: 'Aho Search' },
  summary: {
    zh: 'Aho搜索属于string类别。',
    en: 'Aho Search is a string algorithm.',
  },
  description: {
    zh: 'Aho搜索（Aho Search）属于string类别的算法。',
    en: 'Aho Search is an algorithm in the string category.',
  },
  tags: ["string"],
  complexity: { time: 'O(n+m·|Σ|)', space: 'O(m·|Σ|)' },
};
