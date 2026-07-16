import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ds-btree-2',
  categoryId: 'ds',
  title: { zh: 'B 树（2-3-4 树）', en: 'B-Tree (max 4)' },
  summary: {
    zh: '阶为 4 的 B 树（即 2-3-4 树），插入时自顶向下分裂。',
    en: 'Order-4 B-tree (a.k.a. 2-3-4 tree) with top-down splitting on insert.',
  },
  description: {
    zh: '每个节点最多 3 个关键字、4 个孩子。插入沿路径遇到满节点（3 键）立即分裂，把中间键上提。',
    en: 'Each node holds up to 3 keys and 4 children. On the way down, split any full (3-key) node by promoting the middle key.',
  },
  tags: ['ds', 'b-tree', 'balanced-tree'],
  complexity: { time: 'O(log n)', space: 'O(log n)' },
};
