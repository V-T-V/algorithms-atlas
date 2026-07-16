// 前序遍历迭代版 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'tree-preorder-iter',
  categoryId: 'tree',
  title: { zh: '前序遍历（迭代）', en: 'Preorder Traversal (Iterative)' },
  summary: {
    zh: '用显式栈模拟递归，前序遍历二叉树（根→左→右）。',
    en: 'Preorder traversal via an explicit stack (root→left→right).',
  },
  description: {
    zh:
      '前序遍历迭代版：用一个显式栈替代递归调用栈。' +
      '\n- 初始把根压栈；每次弹出栈顶访问，然后**先压右子、再压左子**，保证左子先出栈。' +
      '\n- 访问顺序即根→左→右，与递归版一致。' +
      '\n时间 `O(n)`，空间 `O(h)`（h 为树高）。相比递归版可避免深递归爆栈，且栈状态可观测。',
    en:
      'Preorder traversal (iterative): an explicit stack replaces the recursion stack. ' +
      '\n- Push the root; on each pop visit the node, then push right before left so the left pops first. ' +
      '\n- Visit order is root→left→right, identical to recursion. ' +
      'Time O(n), space O(h). Avoids recursion-depth overflow and exposes the stack state.',
  },
  tags: ['tree', 'traversal', 'preorder', 'iterative', 'stack'],
  complexity: { time: 'O(n)', space: 'O(h)' },
};
