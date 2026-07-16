// 中序遍历迭代版 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'tree-inorder-iter',
  categoryId: 'tree',
  title: { zh: '中序遍历（迭代）', en: 'Inorder Traversal (Iterative)' },
  summary: {
    zh: '用「栈+当前指针」沿左链压栈到底，弹出即访问的中序遍历。',
    en: 'Inorder traversal via a stack and current pointer; push left spine, pop and visit.',
  },
  description: {
    zh:
      '中序遍历迭代版（左→根→右）：经典「栈 + 当前指针」模式。' +
      '\n- 用 cur 指针沿左子链一路压栈到底。' +
      '\n- 栈非空时弹出栈顶，访问它，然后 cur 转向其右子树。' +
      '\n- 循环直到 cur 为空且栈空。' +
      '\n对二叉搜索树得到升序序列。时间 `O(n)`，空间 `O(h)`。',
    en:
      'Inorder traversal (iterative), left→root→right: the classic "stack + current pointer" pattern. ' +
      '\n- Walk the left spine with cur, pushing every node onto the stack. ' +
      '\n- When the stack is non-empty, pop the top, visit it, then move cur to its right child. ' +
      '\n- Loop until cur is null and the stack is empty. ' +
      'Yields ascending order on a BST. Time O(n), space O(h).',
  },
  tags: ['tree', 'traversal', 'inorder', 'iterative', 'stack'],
  complexity: { time: 'O(n)', space: 'O(h)' },
};
