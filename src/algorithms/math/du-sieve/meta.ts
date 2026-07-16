// Du Sieve · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'du-sieve',
  categoryId: 'math',
  title: { zh: '杜教筛', en: 'Du Sieve' },
  summary: {
    zh: '杜教筛属于math类别。',
    en: 'Du Sieve is a math algorithm.',
  },
  description: {
    zh: '杜教筛（Du Sieve）属于math类别的算法。',
    en: 'Du Sieve is an algorithm in the math category.',
  },
  tags: ["math","number-theory"],
  complexity: { time: 'O(n^{2/3})', space: 'O(n^{2/3})' },
};
