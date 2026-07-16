// Catalan 三角 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'catalan-triangle',
  categoryId: 'math',
  title: { zh: 'Catalan 三角', en: 'Catalan Triangle' },
  summary: {
    zh: '构造 Catalan 三角 T(n,k)，其边界 T(n,0)=1 且 T(n,k)=T(n,k-1)+T(n-1,k)。',
    en: 'Build the Catalan triangle T(n,k) with T(n,0)=1 and T(n,k)=T(n,k-1)+T(n-1,k).',
  },
  description: {
    zh: 'Catalan 三角（又称 Ballot 三角）是一个下三角数表，定义为 T(n,0)=1，T(n,k)=T(n,k-1)+T(n-1,k)（1≤k≤n）。其右上对角线 T(n,n) 即第 n 个 Catalan 数 C_n = (1/(n+1))C(2n,n)。该三角也计数从 (0,0) 到 (n,k) 不越过对角线的路径数（Ballot 问题）。',
    en: 'The Catalan triangle (a.k.a. Ballot triangle) is a lower-triangular number table defined by T(n,0)=1, T(n,k)=T(n,k-1)+T(n-1,k) for 1≤k≤n. Its main diagonal T(n,n) gives the n-th Catalan number C_n = (1/(n+1))C(2n,n). It also counts lattice paths from (0,0) to (n,k) that never cross the diagonal (Ballot problem).',
  },
  tags: ['math', 'combinatorics', 'catalan', 'dp'],
  complexity: { time: 'O(n²)', space: 'O(n²)' },
};
