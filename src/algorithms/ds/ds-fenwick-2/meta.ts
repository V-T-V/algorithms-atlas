import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ds-fenwick-2',
  categoryId: 'ds',
  title: { zh: '树状数组（Fenwick）', en: 'Fenwick Tree (BIT)' },
  summary: {
    zh: '前缀和 + 单点更新，O(log n)，常数极小。',
    en: 'Prefix sum + point update, O(log n) with a tiny constant.',
  },
  description: {
    zh: '利用 lowbit 划分区间，tree[i] 维护长度为 lowbit(i) 的区间和。',
    en: 'Uses lowbit to partition ranges; tree[i] covers a segment of length lowbit(i).',
  },
  tags: ['ds', 'fenwick', 'bit'],
  complexity: { time: 'O(log n)', space: 'O(n)' },
};
