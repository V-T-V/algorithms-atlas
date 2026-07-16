import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ds-fenwick-point',
  categoryId: 'ds',
  title: { zh: '树状数组（单点更新）', en: 'Fenwick Tree (Point Update)' },
  summary: {
    zh: '单点加 + 区间求和的经典 BIT。',
    en: 'Classic BIT: point add + range sum.',
  },
  description: {
    zh: 'lowbit 索引：单点加时向前传播，查询时按 lowbit 累加。时间 O(log n)。',
    en: 'lowbit indexing: point-add propagates upward, query sums lowbit prefixes. O(log n).',
  },
  tags: ['ds', 'fenwick', 'binary-indexed-tree'],
  complexity: { time: 'O(log n)', space: 'O(n)' },
};
