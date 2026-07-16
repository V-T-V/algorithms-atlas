import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'math-twin-prime',
  categoryId: 'math',
  title: { zh: '孪生素数', en: 'Twin Primes' },
  summary: {
    zh: '列出不超过 n 的所有孪生素数对 (p, p+2)。',
    en: 'List all twin prime pairs (p, p+2) with p+2 ≤ n.',
  },
  description: {
    zh: '埃氏筛预处理 0..n 的素数标记，再扫描相邻间隔为 2 的素数对。时间 O(n log log n)，空间 O(n)。',
    en: 'Sieve of Eratosthenes on [0,n], then collect pairs where p and p+2 are both prime. Time O(n log log n), space O(n).',
  },
  tags: ['math', 'prime', 'sieve', 'number-theory'],
  complexity: { time: 'O(n log log n)', space: 'O(n)' },
};
