// 后序遍历迭代版 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'tree-postorder-iter',
  categoryId: 'tree',
  title: { zh: '后序遍历（迭代）', en: 'Postorder Traversal (Iterative)' },
  summary: {
    zh: '用「根→右→左」前序的逆序得到后序，双栈或单栈翻转。',
    en: 'Postorder via the reverse of a root→right→left preorder.',
  },
  description: {
    zh:
      '后序遍历迭代版（左→右→根）：经典技巧——把前序改成「根→右→左」(先压左再压右)，' +
      '得到的序列逆序即为后序「左→右→根」。' +
      '\n- 用一个输出栈收集，最后整体翻转。' +
      '\n- 或直接用一个数组，访问时前插（unshift）。' +
      '\n时间 `O(n)`，空间 `O(h)`。',
    en:
      'Postorder traversal (iterative), left→right→root: the classic trick — run a modified preorder ' +
      'root→right→left (push left before right), then reverse the result to get postorder. ' +
      '\n- Collect into an output stack and flip at the end, or unshift as you go. ' +
      'Time O(n), space O(h).',
  },
  tags: ['tree', 'traversal', 'postorder', 'iterative', 'stack'],
  complexity: { time: 'O(n)', space: 'O(h)' },
};
