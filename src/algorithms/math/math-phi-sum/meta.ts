import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'math-phi-sum',
  categoryId: 'math',
  title: { zh: '欧拉函数前缀和', en: 'Euler Totient Prefix Sum' },
  summary: {
    zh: '求 Φ(n) = Σ_{k=1..n} φ(k)，使用线性筛。',
    en: 'Compute Φ(n) = sum of φ(k) for k=1..n via linear sieve.',
  },
  description: {
    zh: '用线性筛计算 1..n 每个数的 φ(k)，再求前缀和。时间 O(n)，空间 O(n)。',
    en: 'Linear sieve to compute φ(k) for k=1..n, then prefix sum. Time O(n), space O(n).',
  },
  tags: ['math', 'phi', 'totient', 'sieve', 'number-theory'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
