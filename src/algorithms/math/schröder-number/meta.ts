// Schröder 数 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'schröder-number',
  categoryId: 'math',
  title: { zh: '大 Schröder 数', en: 'Large Schröder Number' },
  summary: {
    zh: 'S(n) 计数从 (0,0) 到 (n,n) 不越过对角线的格路（含对角步），递推 O(n²)。',
    en: 'S(n) counts paths from (0,0) to (n,n) not crossing the diagonal with diagonal steps; O(n²).',
  },
  description: {
    zh: '大 Schröder 数 S(n) 表示从 (0,0) 到 (n,n)，每步向右、向上或向右上对角，且不越过对角线 y=x 的路径数。递推 S(n) = S(n-1) + Σ_{k=0}^{n-1} S(k)·S(n-1-k)，S(0)=1。前几项 1,2,6,22,90,394。S(n) 也等于小 Schröder 数的两倍。',
    en: 'The large Schröder number S(n) counts paths from (0,0) to (n,n) using right, up, or diagonal up-right steps that never cross the diagonal y=x. Recurrence S(n) = S(n-1) + Σ_{k=0}^{n-1} S(k)·S(n-1-k), S(0)=1. First terms 1,2,6,22,90,394. S(n) equals twice the small Schröder number.',
  },
  tags: ['math', 'combinatorics', 'schröder', 'lattice-path'],
  complexity: { time: 'O(n²)', space: 'O(n)' },
};
