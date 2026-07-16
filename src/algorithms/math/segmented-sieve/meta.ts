// 分段筛 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'segmented-sieve',
  categoryId: 'math',
  title: { zh: '分段筛', en: 'Segmented Sieve' },
  summary: {
    zh: '在 O(√n) 内存的块内筛出区间 [L, R] 的所有素数，适合大范围。',
    en: 'Sieve primes in [L, R] using only O(√n) memory, suited to large ranges.',
  },
  description: {
    zh: '当 R 很大（如 10^12）时，普通埃氏筛的 O(R) 内存不可行。分段筛先筛 [2, √R] 得到小素数，再把 [L, R] 切成长度约 √R 的若干段，逐段用小素数去标记合数：对每个小素数 p，从段内第一个 p 的倍数开始按步长 p 标记。空间 O(√R)，时间 O((R-L+1) log log R + √R log log √R)。',
    en: 'When R is huge (e.g. 10^12) the O(R) memory of a plain sieve is infeasible. The segmented sieve first sieves [2, √R] for small primes, then chops [L, R] into segments of length ~√R and marks composites within each segment using those small primes: for each small prime p, start at the first multiple of p inside the segment and step by p. Space O(√R), time O((R-L+1) log log R + √R log log √R).',
  },
  tags: ['math', 'number-theory', 'sieve', 'segmented'],
  complexity: { time: 'O((R-L) log log R)', space: 'O(√R)' },
};
