// Brent Method · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'brent',
  categoryId: 'numerical',
  title: { zh: 'Brent 方法', en: 'Brent Method' },
  summary: {
    zh: 'Brent 方法属于numerical类别。',
    en: 'Brent Method is a numerical algorithm.',
  },
  description: {
    zh: 'Brent 方法（Brent Method）属于numerical类别的算法。',
    en: 'Brent Method is an algorithm in the numerical category.',
  },
  tags: ["numerical"],
  complexity: { time: 'O(k)', space: 'O(k)' },
};
