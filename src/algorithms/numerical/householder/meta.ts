// Householder Method · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'householder',
  categoryId: 'numerical',
  title: { zh: 'Householder 方法', en: 'Householder Method' },
  summary: {
    zh: 'Householder 方法属于numerical类别。',
    en: 'Householder Method is a numerical algorithm.',
  },
  description: {
    zh: 'Householder 方法（Householder Method）属于numerical类别的算法。',
    en: 'Householder Method is an algorithm in the numerical category.',
  },
  tags: ["numerical"],
  complexity: { time: 'O(k)', space: 'O(k)' },
};
