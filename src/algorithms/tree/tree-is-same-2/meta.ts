// 两树相同v2 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'tree-is-same-2',
  categoryId: 'tree',
  title: { zh: '两树相同v2', en: 'Same Tree v2' },
  summary: {
    zh: '递归判断两棵二叉树结构与值完全相同。',
    en: 'Recursively check two trees are structurally identical.',
  },
  description: {
    zh: '同时递归：值相等且左右子树相同。',
    en: 'Recurse: same value, same left, same right. O(n).',
  },
  tags: ['tree', 'compare'],
  complexity: { time: 'O(n)', space: 'O(h)' },
};
