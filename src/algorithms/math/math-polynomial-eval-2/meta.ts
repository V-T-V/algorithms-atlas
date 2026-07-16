import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'math-polynomial-eval-2',
  categoryId: 'math',
  title: { zh: '多项式求值（秦九韶）', en: 'Polynomial Evaluation (Horner)' },
  summary: {
    zh: '用秦九韶算法 O(n) 计算 a_0 + a_1·x + ... + a_n·x^n 在 x 处的值。',
    en: 'Horner scheme: O(n) evaluation of polynomial at x.',
  },
  description: {
    zh: '从最高次开始 result = result·x + a_i，避免重复乘方。时间 O(n)，空间 O(1)。',
    en: 'Fold from highest: result = result*x + a_i. Time O(n), space O(1).',
  },
  tags: ['math', 'polynomial', 'horner', 'algebra'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
