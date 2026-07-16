import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'math-prime-count',
  categoryId: 'math',
  title: { zh: '素数计数 π(n)', en: 'Prime Counting π(n)' },
  summary: {
    zh: '统计不超过 n 的素数个数 π(n)，用 Meissel-Lehmer 思想。',
    en: 'Count primes ≤ n (π(n)) via the Meissel-Lehmer approach.',
  },
  description: {
    zh: '素数计数函数 π(n)=不超过 n 的素数个数。对小 n 直接埃氏筛；本实现给出「线性筛 + 累加」的精确计数（适合 n≤10⁷）。大 n 的 Lehmer 公式更高效但实现复杂。时间 O(n)，空间 O(n)。',
    en: 'π(n) = number of primes ≤ n. Here linear sieve + prefix sum (exact for n≤1e7). Larger n needs full Lehmer. Time O(n), space O(n).',
  },
  tags: ['math', 'prime', 'sieve', 'number-theory', 'counting'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
