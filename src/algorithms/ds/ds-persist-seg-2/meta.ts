import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ds-persist-seg-2',
  categoryId: 'ds',
  title: { zh: '可持久化线段树', en: 'Persistent Segment Tree' },
  summary: {
    zh: '每次更新新建一条根到叶的路径，保留所有历史版本。',
    en: 'Each update creates a new root-to-leaf path, preserving all historical versions.',
  },
  description: {
    zh: '只复制被修改的 O(log n) 个节点，其它节点共享。常用于区间第 k 小。',
    en: 'Copies only the O(log n) modified nodes; others are shared. Common for range k-th smallest.',
  },
  tags: ['ds', 'persistent', 'segment-tree'],
  complexity: { time: 'O(log n)', space: 'O(n log n)' },
};
