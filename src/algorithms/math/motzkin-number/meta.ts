// Motzkin 数 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'motzkin-number',
  categoryId: 'math',
  title: { zh: 'Motzkin 数', en: 'Motzkin Number' },
  summary: {
    zh: 'M(n) 计数不越过对角线、仅水平/垂直/对角的格路，递推 O(n²)。',
    en: 'M(n) counts paths never crossing the diagonal using flat/up/down steps; O(n²).',
  },
  description: {
    zh: 'Motzkin 数 M(n) 计数从 (0,0) 到 (n,0)、每步为 (1,1)、(1,0)、(1,−1) 且不越过 x 轴的路径数。递推：M(n) = M(n-1) + Σ_{k=0}^{n-2} M(k)·M(n-2-k)，边界 M(0)=M(1)=1。等价递推 M(n)=((2n+1)M(n-1)+(3n-3)M(n-2))/(n+2)。本实现用 DP。',
    en: 'The Motzkin number M(n) counts paths from (0,0) to (n,0) with steps (1,1),(1,0),(1,−1) that never go below the x-axis. Recurrence M(n) = M(n-1) + Σ_{k=0}^{n-2} M(k)·M(n-2-k), with M(0)=M(1)=1. Equivalent form M(n)=((2n+1)M(n-1)+(3n-3)M(n-2))/(n+2). DP implementation.',
  },
  tags: ['math', 'combinatorics', 'motzkin', 'lattice-path'],
  complexity: { time: 'O(n²)', space: 'O(n)' },
};
