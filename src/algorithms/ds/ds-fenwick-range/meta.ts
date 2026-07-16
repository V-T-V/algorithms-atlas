import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ds-fenwick-range',
  categoryId: 'ds',
  title: { zh: '树状数组（区间更新）', en: 'Fenwick Tree (Range Update)' },
  summary: {
    zh: '差分树状数组支持区间加 + 单点查询。',
    en: 'Difference Fenwick supporting range add + point query.',
  },
  description: {
    zh: '维护差分数组的两个前缀和，使得能做区间加单点查。时间 O(log n)。',
    en: 'Maintain difference-array prefix sums enabling range-add point-query. O(log n) per op.',
  },
  tags: ['ds', 'fenwick', 'binary-indexed-tree', 'range-query'],
  complexity: { time: 'O(log n)', space: 'O(n)' },
};
