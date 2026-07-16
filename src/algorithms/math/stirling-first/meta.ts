import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'stirling-first',
  categoryId: 'math',
  title: { zh: '第一类 Stirling 数', en: 'Stirling Numbers of the First Kind' },
  summary: {
    zh: '把 n 元素分成 k 个非空圆排列的方案数：s(n,k)=s(n-1,k-1)+(n-1)s(n-1,k)。',
    en: 'Ways to arrange n elements into k non-empty cycles: s(n,k)=s(n-1,k-1)+(n-1)s(n-1,k).',
  },
  description: {
    zh: '无符号第一类 Stirling 数 s(n,k)（记 [n k]）表示将 n 个不同元素划分为 k 个非空「圆排列」（循环）的方案数。递推：考虑第 n 个元素——它可单独成环（其余 n-1 个分 k-1 个环，s(n-1,k-1)），或插入已有环中。把新元素插到任一元素的右侧共有 n-1 种插法（其余 n-1 个分 k 个环，s(n-1,k)），故 s(n,k) = s(n-1,k-1) + (n-1)·s(n-1,k)。初值 s(0,0)=1。重要恒等式：n! = Σ_k s(n,k)。时间 O(n²)。',
    en: 'The unsigned Stirling number of the first kind s(n,k) ([n k]) counts ways to partition n distinct elements into k non-empty cycles. Recurrence: element n either forms its own cycle (s(n-1,k-1)) or is inserted to the right of any of the n-1 existing elements (s(n-1,k)), giving s(n,k) = s(n-1,k-1) + (n-1)·s(n-1,k), with s(0,0)=1. Identity: n! = Σ_k s(n,k). Time O(n²).',
  },
  tags: ['math', 'combinatorics', 'stirling', 'recurrence'],
  complexity: { time: 'O(n²)', space: 'O(n²)' },
};
