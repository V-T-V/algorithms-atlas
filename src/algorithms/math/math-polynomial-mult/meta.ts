import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'math-polynomial-mult',
  categoryId: 'math',
  title: { zh: '多项式乘法', en: 'Polynomial Multiplication' },
  summary: {
    zh: '朴素 O(nm) 多项式乘法，返回系数数组。',
    en: 'Naive O(nm) polynomial multiplication returning coefficient array.',
  },
  description: {
    zh: '对每对系数 a_i、b_j 累加到结果 c_{i+j}。时间 O(nm)，空间 O(n+m)。',
    en: 'Accumulate a_i*b_j into c_{i+j}. Time O(nm), space O(n+m).',
  },
  tags: ['math', 'polynomial', 'algebra'],
  complexity: { time: 'O(nm)', space: 'O(n+m)' },
};
