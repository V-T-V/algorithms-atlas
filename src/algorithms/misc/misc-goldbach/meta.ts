// 哥德巴赫验证（Goldbach Verification）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'misc-goldbach',
  categoryId: 'misc',
  title: { zh: '哥德巴赫验证', en: 'Goldbach Verification' },
  summary: {
    zh: '验证偶数可写成两素数之和，枚举素数对。',
    en: 'Verify an even number equals a sum of two primes; enumerate prime pairs.',
  },
  description: {
    zh: '哥德巴赫猜想：每个 >2 的偶数 = 两素数之和。枚举 p≤n/2，检查 n-p 是否素数。',
    en: 'Goldbach: every even >2 is a sum of two primes. Try each p<=n/2, check n-p prime.',
  },
  tags: ['misc', 'number-theory', 'prime'],
  complexity: { time: 'O(√n)', space: 'O(1)' },
};
