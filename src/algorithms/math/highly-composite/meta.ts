// Highly Composite Number · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'highly-composite',
  categoryId: 'math',
  title: { zh: '高合成数', en: 'Highly Composite Number' },
  summary: {
    zh: '高合成数：因子个数比所有更小数都多的数。',
    en: 'Highly composite number: more divisors than any smaller positive integer.',
  },
  description: {
    zh: '高合成数（HCN，Ramanujan 提出）指因子个数严格大于所有更小正整数的数：1, 2, 4, 6, 12, 24, 36, 48, 60, 120, ...。它们在数论与计时（60 进制、24 小时）中常见。本实现枚举 [1, n]，统计每个数的因子数 d(k)，记录所有「比此前最大因子数更多」的数。统计 d(k) 为 O(√k)。',
    en: 'Highly composite numbers (HCN, introduced by Ramanujan) have strictly more divisors than any smaller positive integer: 1, 2, 4, 6, 12, 24, 36, 48, 60, 120, .... They appear in time-keeping (base-60, 24 hours). We enumerate [1, n], compute divisor counts d(k), and record every number exceeding the prior max. Computing d(k) is O(√k).',
  },
  tags: ['math', 'number-theory', 'highly-composite', 'divisors', 'ramanujan'],
  complexity: { time: 'O(n·√n)', space: 'O(n)' },
};
