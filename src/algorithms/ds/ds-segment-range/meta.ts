import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ds-segment-range',
  categoryId: 'ds',
  title: { zh: '线段树（区间更新）', en: 'Segment Tree (Range Update)' },
  summary: {
    zh: '支持区间赋值/查询最大值的线段树（带 lazy 标记）。',
    en: 'Segment tree supporting range assign + range max with lazy propagation.',
  },
  description: {
    zh: '使用数组存储节点，懒标记延迟区间赋值。时间 O(log n) 每次，空间 O(n)。',
    en: 'Array-based segment tree with lazy propagation for range assign. O(log n) per op, O(n) space.',
  },
  tags: ['ds', 'segment-tree', 'range-query', 'lazy'],
  complexity: { time: 'O(log n)', space: 'O(n)' },
};
