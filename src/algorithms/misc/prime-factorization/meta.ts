// 质因数分解 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'prime-factorization',
  categoryId: 'misc',
  title: { zh: '质因数分解', en: 'Prime Factorization' },
  summary: {
    zh: '试除法把整数分解为质数幂之积，O(√n)。',
    en: 'Trial division factors an integer into prime powers in O(√n).',
  },
  description: {
    zh: '算术基本定理：每个大于 1 的整数可唯一分解为质数之积。试除法实现：\n\n- 从 d=2 起尝试除尽当前因子（每除一次记录一次）\n- 一直除到 d² > n\n- 若最后 n > 1，则剩余的 n 本身是一个质因子\n\n优化：先处理 2，再只试奇数 d=3,5,7,...，常数减半。\n\n时间 O(√n)。',
    en: 'Fundamental theorem of arithmetic: every integer > 1 factors uniquely into primes. Trial division:\n\n- From d=2 divide out the current factor (recording each)\n- Continue until d² > n\n- If n > 1 at the end, the remainder is itself a prime factor\n\nOptimization: handle 2 first, then test only odd d=3,5,7,... halving the constant.\n\nTime O(√n).',
  },
  tags: ['number-theory', 'factorization'],
  complexity: { time: 'O(√n)', space: 'O(log n)' },
};
