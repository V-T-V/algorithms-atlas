// 完全数判定 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'perfect-number-check',
  categoryId: 'misc',
  title: { zh: '完全数判定', en: 'Perfect Number Check' },
  summary: {
    zh: '若一个数等于其所有真因数之和，则为完全数（如 6 = 1+2+3）。',
    en: 'A number equal to the sum of its proper divisors is perfect (e.g. 6 = 1+2+3).',
  },
  description: {
    zh: '完全数（perfect number）是数论中的经典概念：一个正整数 n 等于其所有「真因数」（小于 n 的因数）之和。最小的完全数是 6 = 1+2+3，其次是 28 = 1+2+4+7+14，496、8128 等。判定方法：累加 n 的所有真因数（1 到 n-1 中能整除 n 的数），若总和等于 n 则为完全数。更高效的实现只需遍历到 √n，成对累加因数。欧几里得-欧拉定理指出所有偶完全数形如 2^(p-1)·(2^p−1)，其中 2^p−1 为梅森素数；目前尚不知是否存在奇完全数。本实现展示逐因数累加过程。',
    en: 'A perfect number is a classic number-theoretic concept: a positive integer equal to the sum of its "proper divisors" (divisors less than itself). The smallest is 6 = 1+2+3, then 28 = 1+2+4+7+14, 496, 8128, etc. To test it: sum all proper divisors of n (numbers in 1..n-1 that divide n); if the total equals n, it is perfect. A more efficient implementation only iterates up to √n and accumulates divisors in pairs. The Euclid-Euler theorem states every even perfect number is of the form 2^(p-1)·(2^p−1) where 2^p−1 is a Mersenne prime; whether any odd perfect number exists remains open. This implementation visualises the divisor-by-divisor accumulation.',
  },
  tags: ['misc', 'number-theory', 'divisors'],
  complexity: { time: 'O(√n)', space: 'O(1)' },
};
