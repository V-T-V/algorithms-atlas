// 子树判断v2 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'tree-subtree-check-2',
  categoryId: 'tree',
  title: { zh: '子树判断v2', en: 'Is Subtree v2' },
  summary: {
    zh: '判断一棵树是否是另一棵树的子树（结构与值完全相同）。',
    en: 'Whether one tree is a subtree of another (identical structure).',
  },
  description: { zh: '对每个节点尝试匹配。', en: 'Try matching at each node. O(n*m).' },
  tags: ['tree', 'subtree', 'match'],
  complexity: { time: 'O(n*m)', space: 'O(h)' },
};
