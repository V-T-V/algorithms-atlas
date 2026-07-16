import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ds-li-chao-2',
  categoryId: 'ds',
  title: { zh: '李超线段树', en: 'Li Chao Segment Tree' },
  summary: {
    zh: '维护一组直线在 x 上取最大值的线段树。',
    en: 'Segment tree maintaining max over lines at each x.',
  },
  description: {
    zh: '每节点存一条占优直线，按中点比较并下沉。插入 O(log C)，单点查询 O(log C)。',
    en: 'Store one dominant line per node; compare at midpoint and push down. Insert O(log C), query O(log C).',
  },
  tags: ['ds', 'segment-tree', 'geometry', 'line'],
  complexity: { time: 'O(log C)', space: 'O(C)' },
};
