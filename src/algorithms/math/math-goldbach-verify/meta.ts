import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'math-goldbach-verify',
  categoryId: 'math',
  title: { zh: '哥德巴赫验证', en: 'Goldbach Verification' },
  summary: {
    zh: '对 4..N 内的偶数验证是否可表示为两素数之和。',
    en: 'Verify each even in [4,N] equals the sum of two primes.',
  },
  description: {
    zh: '先埃氏筛得到素数表，再对每个偶数 e∈[4,N]，枚举素数 p≤e/2 检查 e-p 是否为素数。时间 O(N²/log N) 最坏，典型 O(N log log N)。',
    en: 'Sieve primes, then for each even e enumerate p≤e/2 and check e-p prime. Worst O(N²/log N), typically O(N log log N).',
  },
  tags: ['math', 'prime', 'goldbach', 'number-theory'],
  complexity: { time: 'O(N²/log N)', space: 'O(N)' },
};
