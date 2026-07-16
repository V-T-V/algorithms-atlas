import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'math-polynomial-deriv',
  categoryId: 'math',
  title: { zh: '多项式求导', en: 'Polynomial Derivative' },
  summary: {
    zh: '对系数数组 a_0..a_n 求导，返回导数系数数组。',
    en: 'Differentiate polynomial given by coefficient array.',
  },
  description: {
    zh: "导数系数 c'_i = (i+1)·a_{i+1}。常数项导数为空数组。时间 O(n)，空间 O(n)。",
    en: "c'_i = (i+1)*a_{i+1}. Constant term differentiates to empty. Time O(n), space O(n).",
  },
  tags: ['math', 'polynomial', 'calculus', 'derivative'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
