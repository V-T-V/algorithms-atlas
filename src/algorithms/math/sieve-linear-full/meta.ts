// 线性筛完整版 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sieve-linear-full',
  categoryId: 'math',
  title: {
    zh: '线性筛完整版（素数 + 欧拉函数）',
    en: 'Linear Sieve Full (Primes + Euler Totient)',
  },
  summary: {
    zh: '线性时间筛素数并同时求出每个数的欧拉函数 φ(i)。',
    en: 'Linear-time sieve producing primes and the Euler totient φ(i) for each i.',
  },
  description: {
    zh: '线性筛保证每个合数恰被其最小质因子筛掉一次，时间 O(n)。在筛的同时可线性求出积性函数，本实现演示欧拉函数 φ 的同步计算：φ[i·p] 在 p 整除 i 时为 φ[i]·p，否则为 φ[i]·(p-1)。返回素数列表与 φ 表。',
    en: 'The linear sieve crosses off each composite exactly once by its least prime factor, in O(n). Multiplicative functions can be computed alongside; this implementation derives the Euler totient φ simultaneously: φ[i·p] = φ[i]·p when p divides i, else φ[i]·(p-1). Returns the prime list and the φ table.',
  },
  tags: ['math', 'number-theory', 'sieve', 'linear', 'euler-totient'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
