// Newton Method · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'newton-method',
  categoryId: 'numerical',
  title: { zh: '牛顿迭代法', en: 'Newton Method' },
  summary: {
    zh: '牛顿迭代法属于numerical类别。',
    en: 'Newton Method is a numerical algorithm.',
  },
  description: {
    zh: '牛顿迭代法（Newton Method）属于numerical类别的算法。',
    en: 'Newton Method is an algorithm in the numerical category.',
  },
  tags: ["numerical","numerical-method"],
  complexity: { time: 'O(k)', space: 'O(1)' },
};
