import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'math-linear-recurrence',
  categoryId: 'math',
  title: { zh: '线性递推（矩阵快速幂）', en: 'Linear Recurrence (Matrix Power)' },
  summary: {
    zh: '给定 k 阶线性递推 a_n = Σ c_i·a_{n-i} 与初值，用矩阵快速幂求第 n 项。',
    en: 'Given k-th order linear recurrence and seeds, compute a_n via matrix exponentiation.',
  },
  description: {
    zh: '构造 k×k 伴随矩阵，对 n-k 次幂做二分快速幂。时间 O(k³ log n)，空间 O(k²)。',
    en: 'Build k×k companion matrix; exponentiate by squaring. Time O(k³ log n), space O(k²).',
  },
  tags: ['math', 'matrix', 'recurrence', 'modular'],
  complexity: { time: 'O(k³ log n)', space: 'O(k²)' },
};
