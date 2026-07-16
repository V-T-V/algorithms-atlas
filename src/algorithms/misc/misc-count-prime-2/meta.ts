// 计数质数 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'misc-count-prime-2',
  categoryId: 'misc',
  title: { zh: '计数质数', en: 'Count Primes' },
  summary: {
    zh: '埃氏筛统计小于 n 的质数个数。',
    en: 'Sieve of Eratosthenes to count primes less than n.',
  },
  description: {
    zh: 'LeetCode 204 计数质数：用埃拉托斯特尼筛法统计 < n 的质数数量。',
    en: 'LeetCode 204 Count Primes: sieve of Eratosthenes to count primes below n.',
  },
  tags: ['misc', 'math', 'sieve', 'leetcode'],
  complexity: { time: 'O(n log log n)', space: 'O(n)' },
};
