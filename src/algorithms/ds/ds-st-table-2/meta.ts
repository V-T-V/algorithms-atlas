import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ds-st-table-2',
  categoryId: 'ds',
  title: { zh: 'ST 表（稀疏表）', en: 'Sparse Table (ST)' },
  summary: {
    zh: 'O(n log n) 预处理后 O(1) 查询静态区间最值（满足可重复贡献）。',
    en: 'O(n log n) preprocessing then O(1) static range-min/max (idempotent queries).',
  },
  description: {
    zh: 'st[k][i] 表示从 i 起长度 2^k 的区间最值，查询用两个重叠区间覆盖。',
    en: 'st[k][i] covers length 2^k starting at i; queries cover the range with two overlapping blocks.',
  },
  tags: ['ds', 'sparse-table', 'rmq'],
  complexity: { time: 'O(1)', space: 'O(n log n)' },
};
