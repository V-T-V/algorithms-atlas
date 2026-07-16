import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'math-polynomial-integ',
  categoryId: 'math',
  title: { zh: '多项式不定积分', en: 'Polynomial Indefinite Integral' },
  summary: {
    zh: '求不定积分（积分常数 C=0），返回系数数组。',
    en: 'Compute indefinite integral (C=0), return coefficient array.',
  },
  description: {
    zh: '积分系数 c_i = a_{i-1}/i，前置 0 作为新常数项。时间 O(n)，空间 O(n+1)。',
    en: 'c_i = a_{i-1}/i; prepend 0 as new constant. Time O(n), space O(n+1).',
  },
  tags: ['math', 'polynomial', 'calculus', 'integral'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
