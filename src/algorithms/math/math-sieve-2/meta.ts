import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'math-sieve-2',
  categoryId: 'math',
  title: { zh: '埃氏筛（标记版）', en: 'Sieve of Eratosthenes' },
  summary: {
    zh: '对 0..n 标记每个数是否为素数。',
    en: 'Mark primality of every integer in [0,n].',
  },
  description: {
    zh: '从 2 开始扫描，将素数的倍数标记为合数。时间 O(n log log n)，空间 O(n)。',
    en: 'From 2 up, mark multiples of each prime as composite. Time O(n log log n), space O(n).',
  },
  tags: ['math', 'prime', 'sieve', 'number-theory'],
  complexity: { time: 'O(n log log n)', space: 'O(n)' },
};
