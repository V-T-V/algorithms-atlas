// Delannoy 数 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'delannoy-number',
  categoryId: 'math',
  title: { zh: 'Delannoy 数', en: 'Delannoy Number' },
  summary: {
    zh: 'D(m,n) 计数从 (0,0) 到 (m,n) 用水平/垂直/对角的步数，递推 O(mn)。',
    en: 'D(m,n) counts paths from (0,0) to (m,n) using horizontal, vertical, and diagonal steps; O(mn).',
  },
  description: {
    zh: 'Delannoy 数 D(m,n) 表示从 (0,0) 走到 (m,n)，每步可向右、向上或向右上对角（三种步）的路径总数。递推 D(m,n) = D(m-1,n) + D(m,n-1) + D(m-1,n-1)，边界 D(0,n)=D(m,0)=1。对角线 D(n,n) 即中心 Delannoy 数。显式公式 D(m,n) = Σ_{k=0}^{min(m,n)} C(m,k)·C(n,k)·2^k。本实现用 DP 递推构造整张表。',
    en: 'The Delannoy number D(m,n) counts paths from (0,0) to (m,n) where each step goes right, up, or diagonally up-right (three step kinds). Recurrence D(m,n) = D(m-1,n) + D(m,n-1) + D(m-1,n-1), with D(0,n)=D(m,0)=1. The diagonal D(n,n) gives the central Delannoy number. Explicit form D(m,n) = Σ_{k=0}^{min(m,n)} C(m,k)·C(n,k)·2^k. This implementation builds the full DP table.',
  },
  tags: ['math', 'combinatorics', 'delannoy', 'lattice-path'],
  complexity: { time: 'O(mn)', space: 'O(mn)' },
};
