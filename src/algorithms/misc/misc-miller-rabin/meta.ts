// Miller-Rabin 素性（Miller-Rabin Primality）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'misc-miller-rabin',
  categoryId: 'misc',
  title: { zh: 'Miller-Rabin 素性', en: 'Miller-Rabin Primality' },
  summary: {
    zh: '概率素性测试：基于费马小定理与平方链，错误率 ≤ 1/4。',
    en: 'Probabilistic primality test via Fermat + squaring chain; error <= 1/4 per round.',
  },
  description: {
    zh: 'Miller-Rabin：n-1=d·2^r。对随机 a，a^d≡1 或 a^(d·2^i)≡-1 (mod n) 某 i<r。否则合数。',
    en: 'Miller-Rabin: n-1=d·2^r. For random a, a^d≡1 or a^(d·2^i)≡-1 for some i<r, else composite.',
  },
  tags: ['misc', 'number-theory', 'prime', 'randomized'],
  complexity: { time: 'O(k·log n)', space: 'O(1)' },
};
