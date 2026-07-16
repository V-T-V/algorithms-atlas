// Fast Exponentiation · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'fast-power',
  categoryId: 'math',
  title: { zh: '快速幂', en: 'Fast Exponentiation' },
  summary: {
    zh: '快速幂属于math类别。',
    en: 'Fast Exponentiation is a math algorithm.',
  },
  description: {
    zh: '快速幂（Fast Exponentiation）属于math类别的算法。',
    en: 'Fast Exponentiation is an algorithm in the math category.',
  },
  tags: ["math"],
  complexity: { time: 'O(log exp)', space: 'O(1)' },
};
