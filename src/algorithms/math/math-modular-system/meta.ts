import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'math-modular-system',
  categoryId: 'math',
  title: { zh: '同余方程组', en: 'System of Congruences (CRT)' },
  summary: {
    zh: '求解同余方程组 x ≡ r_i (mod m_i)，非互素时合并同余。',
    en: 'Solve x ≡ r_i (mod m_i); merge pairwise even when moduli not coprime.',
  },
  description: {
    zh: "逐个合并：x≡a (mod n), x≡b (mod m) 用扩展欧几里得合并为 x≡a' (mod lcm(n,m))，若无解则整体无解。",
    en: 'Merge pairwise: solve x≡a (mod n), x≡b (mod m) into a single congruence mod lcm(n,m); abort if inconsistent.',
  },
  tags: ['math', 'crt', 'modular', 'number-theory'],
  complexity: { time: 'O(k · log M)', space: 'O(1)' },
};
