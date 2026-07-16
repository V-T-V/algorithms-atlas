// 计数素数 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'misc-count-primes',
  categoryId: 'misc',
  title: { zh: '计数素数', en: 'Count Primes' },
  summary: {
    zh: '统计小于 n 的素数个数，埃氏筛 O(n log log n)（LeetCode 204）。',
    en: 'Count primes less than n using the Sieve of Eratosthenes, O(n log log n) (LeetCode 204).',
  },
  description: {
    zh: 'LeetCode 204 计数素数（埃拉托斯特尼筛）：\n\n- 布尔数组 isPrime[0..n)，初始全 true。\n- 从 2 起，每遇到一个素数 p，把它的所有倍数标记为合数。\n- 直到 p*p >= n 停止筛。\n- 计数剩余 true 的个数。',
    en: 'LeetCode 204 Count Primes (Sieve of Eratosthenes):\n\n- Boolean array isPrime[0..n), initially all true.\n- Starting at 2, for each prime p, mark all its multiples composite.\n- Stop sieving when p*p >= n.\n- Count the remaining true entries.',
  },
  tags: ['misc', 'number-theory', 'sieve', 'leetcode'],
  complexity: { time: 'O(n log log n)', space: 'O(n)' },
};
