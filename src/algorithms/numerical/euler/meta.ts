// Euler Method · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'euler',
  categoryId: 'numerical',
  title: { zh: '欧拉法', en: 'Euler Method' },
  summary: {
    zh: '欧拉法属于numerical类别。',
    en: 'Euler Method is a numerical algorithm.',
  },
  description: {
    zh: '欧拉法（Euler Method）属于numerical类别的算法。',
    en: 'Euler Method is an algorithm in the numerical category.',
  },
  tags: ["numerical","numerical-method"],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
