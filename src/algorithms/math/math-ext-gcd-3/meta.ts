import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'math-ext-gcd-3',
  categoryId: 'math',
  title: { zh: '扩展欧几里得（迭代）', en: 'Extended Euclidean (Iterative)' },
  summary: {
    zh: '迭代实现，返回 gcd(a,b) 及贝祖系数 x,y 满足 ax+by=gcd。',
    en: 'Iterative; returns gcd plus Bezout coefficients x,y with ax+by=gcd.',
  },
  description: {
    zh: '迭代版的扩展欧几里得：维护旧系数与新系数，每轮按商更新，最终回溯得到 ax+by=g 的解。',
    en: 'Maintain old/new coefficient rows, update by quotient each round; reconstructs the Bezout identity at the end.',
  },
  tags: ['math', 'gcd', 'bezout'],
  complexity: { time: 'O(log min(a,b))', space: 'O(1)' },
};
