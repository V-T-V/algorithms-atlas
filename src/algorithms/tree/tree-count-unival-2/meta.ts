// 同值子树v2 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'tree-count-unival-2',
  categoryId: 'tree',
  title: { zh: '同值子树v2', en: 'Count Unival Subtrees v2' },
  summary: {
    zh: '统计二叉树中所有节点值相同的子树数量。',
    en: 'Count subtrees where all nodes share the same value.',
  },
  description: {
    zh: '后序：左右都是 unival 且等于根时，本子树也是 unival。',
    en: 'Post-order; unival if children match root. O(n).',
  },
  tags: ['tree', 'unival', 'postorder'],
  complexity: { time: 'O(n)', space: 'O(h)' },
};
