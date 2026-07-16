import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'math-stirling-3',
  categoryId: 'math',
  title: { zh: '第二类 Stirling 数', en: 'Stirling Numbers of the Second Kind' },
  summary: {
    zh: 'S(n,k) 表示把 n 个不同元素分成 k 个非空相同集合的方案数。',
    en: 'S(n,k) counts ways to partition n distinct elements into k non-empty identical sets.',
  },
  description: {
    zh: '递推：S(n,k)=k·S(n-1,k)+S(n-1,k-1)；S(0,0)=1。本实现递推求 S(n,k)。',
    en: 'Recurrence: S(n,k)=k·S(n-1,k)+S(n-1,k-1); S(0,0)=1. Iterative DP here.',
  },
  tags: ['math', 'stirling', 'combinatorics'],
  complexity: { time: 'O(nk)', space: 'O(nk)' },
};
