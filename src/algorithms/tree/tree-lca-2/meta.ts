// 最近公共祖先v2 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'tree-lca-2',
  categoryId: 'tree',
  title: { zh: '最近公共祖先v2', en: 'Lowest Common Ancestor v2' },
  summary: {
    zh: '在一般二叉树中求两节点 p、q 的最近公共祖先。',
    en: 'Lowest common ancestor of p and q in a binary tree.',
  },
  description: {
    zh: '递归：在当前子树找 p/q，若左右各命中一个则当前即 LCA。',
    en: 'Recurse; if p,q split across children, current is LCA. O(n).',
  },
  tags: ['tree', 'lca', 'dfs'],
  complexity: { time: 'O(n)', space: 'O(h)' },
};
