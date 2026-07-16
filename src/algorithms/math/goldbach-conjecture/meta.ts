import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'goldbach-conjecture',
  categoryId: 'math',
  title: { zh: '哥德巴赫猜想', en: 'Goldbach Conjecture' },
  summary: {
    zh: '验证偶数 n 可写为两素数之和：枚举 p 与 n-p。',
    en: 'Verify even n as a sum of two primes by checking p and n-p.',
  },
  description: {
    zh: '强哥德巴赫猜想：每个大于 2 的偶数都能表示为两个素数之和（至今未被证明，但已验证到 4×10¹⁸）。本实现对给定偶数 n，先用埃氏筛生成 2..n 的素数表，然后枚举 p 从 2 到 n/2，若 p 与 n-p 都是素数，则返回一组分解 (p, n-p)。还可统计 n 的所有分拆数。时间主要由筛法主导，O(n log log n)。',
    en: 'The strong Goldbach conjecture states every even integer greater than 2 is the sum of two primes (unproven but verified to 4×10¹⁸). Given an even n, this implementation sieves primes up to n then scans p from 2 to n/2; if both p and n-p are prime it returns the decomposition. A partition counter is also provided. Time dominated by the sieve, O(n log log n).',
  },
  tags: ['math', 'number-theory', 'prime', 'goldbach', 'conjecture'],
  complexity: { time: 'O(n log log n)', space: 'O(n)' },
};
