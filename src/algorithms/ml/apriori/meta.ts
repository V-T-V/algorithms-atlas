// Apriori · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'apriori',
  categoryId: 'ml',
  title: { zh: 'Apriori关联规则', en: 'Apriori' },
  summary: {
    zh: 'Apriori关联规则属于ml类别。',
    en: 'Apriori is a ml algorithm.',
  },
  description: {
    zh: 'Apriori关联规则（Apriori）属于ml类别的算法。',
    en: 'Apriori is an algorithm in the ml category.',
  },
  tags: ["ml"],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
