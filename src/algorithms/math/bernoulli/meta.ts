// Bernoulli Number · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'bernoulli',
  categoryId: 'math',
  title: { zh: '伯努利数', en: 'Bernoulli Number' },
  summary: {
    zh: '伯努利数属于math类别。',
    en: 'Bernoulli Number is a math algorithm.',
  },
  description: {
    zh: '伯努利数（Bernoulli Number）属于math类别的算法。',
    en: 'Bernoulli Number is an algorithm in the math category.',
  },
  tags: ["math"],
  complexity: { time: 'O(n²)', space: 'O(n)' },
};
