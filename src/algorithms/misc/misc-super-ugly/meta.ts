// 超级丑数 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'misc-super-ugly',
  categoryId: 'misc',
  title: { zh: '超级丑数', en: 'Super Ugly Number' },
  summary: {
    zh: '给定质数集 primes，求第 n 个只含这些因子的数，多指针合并（LeetCode 313）。',
    en: 'Given a prime set, find the n-th number whose only factors are those primes, via multi-pointer merge (LeetCode 313).',
  },
  description: {
    zh: 'LeetCode 313 超级丑数：\n\n- 给定质数数组 primes，超级丑数 = 只含 primes 中因子的正整数。\n- 第 n 个超级丑数（1 是第一个）。\n- 多指针法：每个质数一个指针，每次取 min(ugly[ptr[p]]*primes[p])，推进产生最小值的指针（去重）。',
    en: 'LeetCode 313 Super Ugly Number:\n\n- Given primes, a super ugly number has only those prime factors.\n- Find the n-th one (1 is first).\n- Multi-pointer method: one pointer per prime; take min(ugly[ptr[p]]*primes[p]); advance pointers producing the min (deduplicate).',
  },
  tags: ['misc', 'dp', 'multi-pointer', 'leetcode'],
  complexity: { time: 'O(n · k)', space: 'O(n + k)' },
};
