import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'math-bern-3',
  categoryId: 'math',
  title: { zh: 'Bernoulli 数（有理数）', en: 'Bernoulli Numbers (Rational)' },
  summary: {
    zh: '用递推关系求前 n 个 Bernoulli 数（精确分数形式）。',
    en: 'Compute the first n Bernoulli numbers as exact rationals via recurrence.',
  },
  description: {
    zh: '递推：Σ_{k=0}^{m} C(m+1,k)·B(k) = 0（m≥1），B(0)=1。奇下标 >1 全为 0。用 bigint 分子分母精确表示。',
    en: 'Recurrence: Σ_{k=0}^{m} C(m+1,k)·B(k) = 0 with B(0)=1; odd indices >1 are zero. Stored as bigint numerator/denominator.',
  },
  tags: ['math', 'bernoulli', 'rational'],
  complexity: { time: 'O(n²)', space: 'O(n)' },
};
