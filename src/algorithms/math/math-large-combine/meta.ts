import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'math-large-combine',
  categoryId: 'math',
  title: { zh: '大数组合数', en: 'Large Combination (BigInt)' },
  summary: {
    zh: '用 BigInt 精确计算 C(n, k)。',
    en: 'Compute C(n, k) exactly using BigInt.',
  },
  description: {
    zh: '利用 C(n,k) = C(n,k-1)·(n-k+1)/k 递推，每次乘后立即整除避免分数。时间 O(k)，空间 O(1)。',
    en: 'Iterative formula C(n,k)=C(n,k-1)*(n-k+1)/k; multiply-then-divide to stay integral. Time O(k), space O(1).',
  },
  tags: ['math', 'combinatorics', 'bigint', 'number-theory'],
  complexity: { time: 'O(k)', space: 'O(1)' },
};
