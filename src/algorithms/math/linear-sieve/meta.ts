// Linear Sieve · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'linear-sieve',
  categoryId: 'math',
  title: { zh: '线性筛', en: 'Linear Sieve' },
  summary: {
    zh: '线性筛属于math类别。',
    en: 'Linear Sieve is a math algorithm.',
  },
  description: {
    zh: '线性筛（Linear Sieve）属于math类别的算法。',
    en: 'Linear Sieve is an algorithm in the math category.',
  },
  tags: ["math","number-theory"],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
