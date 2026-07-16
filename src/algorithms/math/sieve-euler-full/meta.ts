// 欧拉筛完整版 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sieve-euler-full',
  categoryId: 'math',
  title: {
    zh: '欧拉筛完整版（素数 + 最小质因子）',
    en: 'Euler Sieve Full (Primes + Least Prime Factor)',
  },
  summary: {
    zh: '线性时间筛出 [2, n] 所有素数及每个数的最小质因子。',
    en: 'Linear-time sieve yielding all primes in [2, n] and the least prime factor of each number.',
  },
  description: {
    zh: '欧拉筛（线性筛）保证每个合数恰被其最小质因子筛掉一次，时间 O(n)。完整版同时维护最小质因子数组 lpf[i]：对每个 i，用已知素数 p ≤ lpf[i] 标记 i·p 为合数并设 lpf[i·p] = p。可顺便求欧拉函数 φ、莫比乌斯函数 μ 等。本实现返回素数列表与 lpf 表。',
    en: 'The Euler (linear) sieve guarantees each composite is crossed off exactly once by its least prime factor, giving O(n) time. The full version also maintains the least-prime-factor array lpf[i]: for each i, use known primes p ≤ lpf[i] to mark i·p composite and set lpf[i·p] = p. Can also derive φ, μ etc. This implementation returns the prime list and the lpf table.',
  },
  tags: ['math', 'number-theory', 'sieve', 'linear'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
