// 翻转二叉树 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'tree-invert',
  categoryId: 'tree',
  title: { zh: '翻转二叉树', en: 'Invert Binary Tree' },
  summary: {
    zh: '递归交换每个节点的左右子树，得到镜像二叉树（LeetCode 226）。',
    en: "Recursively swap each node's children to obtain the mirror tree (LeetCode 226).",
  },
  description: {
    zh:
      '翻转二叉树（Invert Binary Tree，LeetCode 226）：对每个节点交换其左右子树，' +
      '递归处理。结果是与原树镜像对称的树。' +
      '\n- 递归版：swap(node.left, node.right)，再翻转左右子树。' +
      '\n- 也可用 BFS 层序交换。' +
      '\n时间 `O(n)`，空间 `O(h)`。原地修改输入树（克隆后再翻转更安全）。',
    en:
      "Invert Binary Tree (LeetCode 226): swap each node's left and right subtrees recursively. " +
      'The result is the mirror of the original. ' +
      '\n- Recursive: swap(node.left, node.right), then invert both subtrees. ' +
      '\n- A BFS level-order swap also works. ' +
      'Time O(n), space O(h). Mutates the input tree in place (clone first for safety).',
  },
  tags: ['tree', 'invert', 'mirror', 'recursive'],
  complexity: { time: 'O(n)', space: 'O(h)' },
};
