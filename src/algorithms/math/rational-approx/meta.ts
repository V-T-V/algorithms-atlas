// Rational Approx · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'rational-approx',
  categoryId: 'math',
  title: { zh: '有理逼近', en: 'Rational Approx' },
  summary: {
    zh: '有理逼近属于math类别。',
    en: 'Rational Approx is a math algorithm.',
  },
  description: {
    zh: '有理逼近（Rational Approx）属于math类别的算法。',
    en: 'Rational Approx is an algorithm in the math category.',
  },
  tags: ["math"],
  complexity: { time: 'O(log N)', space: 'O(log N)' },
};
