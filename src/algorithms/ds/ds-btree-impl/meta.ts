import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ds-btree-impl',
  categoryId: 'ds',
  title: { zh: 'B 树实现', en: 'B-Tree Implementation' },
  summary: {
    zh: '最小度数 t 的 B 树（插入 + 查找）。',
    en: 'B-Tree of minimum degree t (insert and search).',
  },
  description: {
    zh: '节点最多 2t-1 个键、2t 个子节点；插入时先分裂满子节点再下行。时间 O(log n)。',
    en: 'Up to 2t-1 keys per node, 2t children; pre-split full children on the way down. O(log n).',
  },
  tags: ['ds', 'tree', 'btree', 'balanced'],
  complexity: { time: 'O(log n)', space: 'O(n)' },
};
