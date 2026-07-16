// 水仙花数（Narcissistic Number）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'misc-narcissistic-number',
  categoryId: 'misc',
  title: { zh: '水仙花数', en: 'Narcissistic Number' },
  summary: {
    zh: '各位数字的 k 次幂和等于自身的 k 位数，如 153=1³+5³+3³。',
    en: 'A k-digit number equal to the sum of its digits each raised to the k-th power, e.g. 153.',
  },
  description: {
    zh: '水仙花数（自幂数）：k 位数 n，n=Σ d_i^k。如 153=1³+5³+3³。',
    en: 'Narcissistic: k-digit n with n=Σ d_i^k. E.g. 153=1³+5³+3³.',
  },
  tags: ['misc', 'number-theory'],
  complexity: { time: 'O(k)', space: 'O(1)' },
};
