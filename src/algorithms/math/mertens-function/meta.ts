// Mertens 函数 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'mertens-function',
  categoryId: 'math',
  title: { zh: 'Mertens 函数（莫比乌斯前缀和）', en: 'Mertens Function (Prefix Sum of Möbius)' },
  summary: {
    zh: 'M(n) = Σ_{k=1}^{n} μ(k)，用线性筛求 μ 后做前缀和。',
    en: 'M(n) = Σ_{k=1}^{n} μ(k); linear sieve for μ then prefix-sum.',
  },
  description: {
    zh: 'Mertens 函数 M(n) 是莫比乌斯函数 μ 的前缀和：M(n) = Σ_{k=1}^{n} μ(k)。它刻画了不超过 n 的「无平方因子整数按素因子个数加权」的累计，与素数计数的黎曼假设相关。先用线性筛在 O(n) 内求出 μ 表（μ(1)=1；含平方因子为 0；否则 (−1)^素因子数），再做前缀和即得 M。',
    en: 'The Mertens function M(n) is the prefix sum of the Möbius function μ: M(n) = Σ_{k=1}^{n} μ(k). It characterizes the running total of square-free integers weighted by prime-factor parity and ties into the Riemann hypothesis for prime counting. First linearly sieve the μ table in O(n) (μ(1)=1; 0 if a square divides n; else (−1)^#primes), then prefix-sum to get M.',
  },
  tags: ['math', 'number-theory', 'mobius', 'prefix-sum'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
