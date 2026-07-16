// 对称树判定 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'tree-is-symmetric',
  categoryId: 'tree',
  title: { zh: '对称二叉树', en: 'Symmetric Tree' },
  summary: {
    zh: '递归判定二叉树是否关于根轴对称（镜像）。',
    en: 'Recursively decide whether a binary tree is a mirror of itself.',
  },
  description: {
    zh:
      '对称二叉树（Symmetric Tree，LeetCode 101）：一棵二叉树对称，当且仅当其左右子树互为镜像。' +
      '\n- 两棵子树 a、b 互为镜像当且仅当：' +
      '\n  · 二者根值相等；' +
      '\n  · a 的左子 与 b 的右子 互为镜像；' +
      '\n  · a 的右子 与 b 的左子 互为镜像。' +
      '\n递归 / 迭代均可，时间 `O(n)`，空间 `O(h)`。',
    en:
      'Symmetric Tree (LeetCode 101): a binary tree is symmetric iff its left and right subtrees are mirrors. ' +
      '\n- Trees a, b are mirrors iff: ' +
      '\n  · their root values are equal; ' +
      '\n  · a.left mirrors b.right; ' +
      '\n  · a.right mirrors b.left. ' +
      'Recursive or iterative; time O(n), space O(h).',
  },
  tags: ['tree', 'symmetric', 'mirror', 'recursive'],
  complexity: { time: 'O(n)', space: 'O(h)' },
};
