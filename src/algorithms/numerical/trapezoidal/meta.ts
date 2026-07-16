// Trapezoidal Rule · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'trapezoidal',
  categoryId: 'numerical',
  title: { zh: '梯形积分', en: 'Trapezoidal Rule' },
  summary: {
    zh: '梯形积分属于numerical类别。',
    en: 'Trapezoidal Rule is a numerical algorithm.',
  },
  description: {
    zh: '梯形积分（Trapezoidal Rule）属于numerical类别的算法。',
    en: 'Trapezoidal Rule is an algorithm in the numerical category.',
  },
  tags: ["numerical"],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
