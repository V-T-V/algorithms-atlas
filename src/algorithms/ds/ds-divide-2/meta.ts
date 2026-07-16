import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ds-divide-2',
  categoryId: 'ds',
  title: { zh: 'CDQ 分治', en: 'CDQ Divide and Conquer' },
  summary: {
    zh: '离线处理三维偏序，用分治替代数据结构，常数更优。',
    en: 'Offline 3D partial-order via divide-and-conquer, replacing heavy data structures.',
  },
  description: {
    zh: '按第一维排序后分治，左半对右半的贡献用归并/树状数组累计。',
    en: 'Sort by dim-1, then recurse; left-half contributions to right-half are accumulated via merge / BIT.',
  },
  tags: ['ds', 'cdq', 'divide-and-conquer'],
  complexity: { time: 'O(n log^2 n)', space: 'O(n)' },
};
