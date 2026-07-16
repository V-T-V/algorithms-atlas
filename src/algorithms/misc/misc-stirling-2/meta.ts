// 第二类 Stirling（Stirling Numbers Second Kind）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'misc-stirling-2',
  categoryId: 'misc',
  title: { zh: '第二类 Stirling', en: 'Stirling Numbers Second Kind' },
  summary: {
    zh: 'S(n,k)：把 n 个不同元素分到 k 个相同非空盒的方案数。',
    en: 'S(n,k): ways to partition n distinct items into k identical nonempty boxes.',
  },
  description: {
    zh: '第二类 Stirling：S(n,k)=k·S(n-1,k)+S(n-1,k-1)，S(0,0)=1。计数集合划分。',
    en: 'Stirling second kind: S(n,k)=k·S(n-1,k)+S(n-1,k-1), S(0,0)=1. Counts set partitions.',
  },
  tags: ['misc', 'combinatorics'],
  complexity: { time: 'O(n·k)', space: 'O(n·k)' },
};
