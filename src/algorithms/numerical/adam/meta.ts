// Adams Method · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'adam',
  categoryId: 'numerical',
  title: { zh: '亚当斯法', en: 'Adams Method' },
  summary: {
    zh: '亚当斯法属于numerical类别。',
    en: 'Adams Method is a numerical algorithm.',
  },
  description: {
    zh: '亚当斯法（Adams Method）属于numerical类别的算法。',
    en: 'Adams Method is an algorithm in the numerical category.',
  },
  tags: ["numerical"],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
