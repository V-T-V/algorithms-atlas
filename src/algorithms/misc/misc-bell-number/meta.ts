// 贝尔数（Bell Number）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'misc-bell-number',
  categoryId: 'misc',
  title: { zh: '贝尔数', en: 'Bell Number' },
  summary: {
    zh: 'B_n：n 个元素的集合划分数，等于 Σ S(n,k)。',
    en: 'B_n: number of partitions of an n-element set; equals sum of S(n,k).',
  },
  description: {
    zh: '贝尔数 B_n=Σ_{k=0}^n S(n,k)。用 Bell 三角 O(n²) 计算。',
    en: 'Bell B_n=Σ S(n,k). Computed via Bell triangle in O(n²).',
  },
  tags: ['misc', 'combinatorics'],
  complexity: { time: 'O(n²)', space: 'O(n)' },
};
