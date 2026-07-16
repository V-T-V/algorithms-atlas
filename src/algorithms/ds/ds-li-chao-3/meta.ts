import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ds-li-chao-3',
  categoryId: 'ds',
  title: { zh: '李超线段树', en: 'Li Chao Segment Tree' },
  summary: {
    zh: '维护若干线性函数，支持区间插入与查询 x 处最大值。',
    en: 'Maintains a set of linear functions; supports segment insertion and max-at-x query.',
  },
  description: {
    zh: '每个节点存「优势直线」，通过中点比较决定下传。单次操作 O(log C)。',
    en: 'Each node stores the dominant line at the midpoint; comparison decides which line descends. O(log C) per op.',
  },
  tags: ['ds', 'li-chao', 'segment-tree', 'geometry'],
  complexity: { time: 'O(log C)', space: 'O(n)' },
};
