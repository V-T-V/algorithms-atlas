// 埃氏筛法 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'num-sieve-eratosthenes',
  categoryId: 'numerical',
  title: { zh: '埃氏筛法', en: 'Sieve of Eratosthenes' },
  summary: { zh: '枚举不超过 n 的所有素数。', en: 'List all primes up to n.' },
  description: {
    zh: '标记每个素数的倍数为合数，剩余为素数。',
    en: 'Mark multiples of each prime as composite.',
  },
  tags: ['numerical', 'prime', 'sieve'],
  complexity: { time: 'O(n log log n)', space: 'O(n)' },
};
