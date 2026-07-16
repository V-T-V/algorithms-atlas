import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ds-persistent-seg-2',
  categoryId: 'ds',
  title: { zh: '可持久化线段树', en: 'Persistent Segment Tree' },
  summary: {
    zh: '支持历史版本查询的主席树（k 小值）。',
    en: 'Persistent seg tree supporting version queries (k-th smallest).',
  },
  description: {
    zh: '每次更新只创建 O(log n) 个新节点，旧版本保留可查询。前缀版本求 k 小值。',
    en: 'Each update creates O(log n) new nodes; old versions retained. Prefix versions support k-th smallest.',
  },
  tags: ['ds', 'persistent', 'segment-tree'],
  complexity: { time: 'O(log n)', space: 'O(n log n)' },
};
