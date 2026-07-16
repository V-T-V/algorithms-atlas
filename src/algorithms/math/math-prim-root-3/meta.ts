import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'math-prim-root-3',
  categoryId: 'math',
  title: { zh: '原根（求最小原根）', en: 'Primitive Root (Smallest)' },
  summary: {
    zh: '求模 m 的最小原根 g：使 g 的阶为 φ(m)。',
    en: 'Find the smallest primitive root g modulo m, whose order equals φ(m).',
  },
  description: {
    zh: '先求 φ(m)，分解其质因数 p_i。对每个候选 g，若对所有 p_i 满足 g^(φ(m)/p_i) ≢ 1 mod m，则 g 是原根。',
    en: 'Compute φ(m), factor it. For candidate g, if g^(φ(m)/p_i) ≢ 1 mod m for every prime factor p_i, then g is a primitive root.',
  },
  tags: ['math', 'primitive-root', 'number-theory'],
  complexity: { time: 'O(m log² m)', space: 'O(log m)' },
};
