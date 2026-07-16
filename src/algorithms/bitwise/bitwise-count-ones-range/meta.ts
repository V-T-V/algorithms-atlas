// 区间内 1 的个数 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'bitwise-count-ones-range',
  categoryId: 'bitwise',
  title: { zh: '区间内 1 的个数', en: 'Count Set Bits in Range' },
  summary: {
    zh: '用前缀差 popcount(lo..hi) = S(hi) - S(lo-1)，S(n) 为 O(log n) 递推。',
    en: 'Range set-bit count via prefix difference: S(hi) − S(lo−1) with O(log n) per S.',
  },
  description: {
    zh:
      '区间内 1 的个数（Count Set Bits in [lo, hi]）：求 [lo, hi] 中每个整数的二进制 1 的总数。' +
      '\n用前缀函数 `S(n) = Σ_{i=0}^{n} popcount(i)`，有 O(log n) 递推：' +
      '\n- 把 n 写成二进制，从高位到低位扫描；' +
      '\n- 若第 k 位（值 2^k）为 1，则贡献：' +
      '\n  · 低 k 位全组合的一半 1：`k · 2^(k-1)`' +
      '\n  · 加上 n 的低位剩余部分 `n - 2^k + 1`（这些数的该位均为 1）。' +
      '\n最终 `count(lo..hi) = S(hi) - S(lo-1)`。',
    en:
      'Count set bits in [lo, hi]: total number of 1-bits across all integers in the range. ' +
      '\nUse prefix function S(n) = Σ_{i=0}^{n} popcount(i) with an O(log n) recurrence: ' +
      "\n- Scan n's bits from high to low; " +
      '\n- when bit k (value 2^k) is 1, add k · 2^(k−1) (half the low-k combinations) plus ' +
      '(n − 2^k + 1) (these numbers all have that bit set). ' +
      'Finally count(lo..hi) = S(hi) − S(lo−1).',
  },
  tags: ['bitwise', 'popcount', 'range', 'digit-dp', 'O(log n)'],
  complexity: { time: 'O(log n)', space: 'O(1)' },
};
