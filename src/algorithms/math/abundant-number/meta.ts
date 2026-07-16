// Abundant Number · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'abundant-number',
  categoryId: 'math',
  title: { zh: '盈数判定', en: 'Abundant Number' },
  summary: {
    zh: '判定盈数：真因子和大于自身。',
    en: 'Test abundant numbers: sum of proper divisors exceeds the number.',
  },
  description: {
    zh: '盈数（abundant number）n 满足 σ(n) > n，即真因子之和大于 n 本身。最小盈数是 12（1+2+3+4+6=16>12）。与之相对：亏数（σ<n）、完全数（σ=n）。所有大于 20161 的整数都可表示为两个盈数之和。判定 O(√n)。',
    en: 'An abundant number n has σ(n) > n, i.e. the sum of proper divisors exceeds n. Smallest is 12 (1+2+3+4+6=16>12). Opposites: deficient (σ<n), perfect (σ=n). Every integer > 20161 is the sum of two abundant numbers. Test O(√n).',
  },
  tags: ['math', 'number-theory', 'abundant', 'divisors'],
  complexity: { time: 'O(√n)', space: 'O(1)' },
};
