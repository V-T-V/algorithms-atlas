import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sieve-segmented',
  categoryId: 'math',
  title: { zh: '分段筛', en: 'Segmented Sieve' },
  summary: {
    zh: '用 √R 内基素数在 [L,R] 分块上划合数，空间友好。',
    en: 'Sieve [L,R] using base primes up to √R; memory-friendly for large ranges.',
  },
  description: {
    zh: '当需要求一个大区间 [L,R] 内的素数（例如 R 达 10¹² 但 R-L 较小）时，传统埃氏筛 O(R) 空间不可行。分段筛先用基础筛求出 √R 以内的素数表，再在长度 Δ=R-L+1 的布尔块上，对每个基素数 p 把 [L,R] 内 p 的倍数标记为合数。空间仅需 O(√R + Δ)。本实现返回 [max(L,2), R] 的全部素数。时间 O((R-L+1) log log R + √R log log √R)。',
    en: 'To list primes in a large range [L,R] (e.g. R up to 10¹² with small R-L), the O(R) memory of the classic sieve is infeasible. The segmented sieve first sieves base primes up to √R, then marks multiples of each base prime within a length-(R-L+1) boolean block. Memory is only O(√R + Δ). Returns all primes in [max(L,2), R]. Time O((R-L+1) log log R + √R log log √R).',
  },
  tags: ['math', 'number-theory', 'prime', 'sieve', 'segmented'],
  complexity: { time: 'O(Δ log log R)', space: 'O(√R + Δ)' },
};
