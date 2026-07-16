// 展开为链表 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'tree-flatten-linked',
  categoryId: 'tree',
  title: { zh: '展开为链表', en: 'Flatten to Linked List' },
  summary: {
    zh: '把二叉树按前序展开为每个节点只有右子的链表（LeetCode 114）。',
    en: 'Flatten a binary tree into a right-only linked list in preorder (LeetCode 114).',
  },
  description: {
    zh:
      '展开为链表（Flatten Binary Tree to Linked List，LeetCode 114）：把二叉树原地改造成 ' +
      '「前序遍历对应的单链表」——所有左指针置 null，右指针指向下一个前序节点。' +
      '\n递归策略（自底向上）：' +
      '\n- 先递归展开左、右子树。' +
      '\n- 把展开后的左链插到当前节点与右链之间：node.right = leftChain; 沿 right 走到末尾接上 rightChain。' +
      '\n- node.left = null。' +
      '\n时间 `O(n)`，空间 `O(h)`（递归）。也可用前序迭代 + 重链 O(1) 空间版。',
    en:
      'Flatten to Linked List (LeetCode 114): in-place transform a binary tree into the right-only ' +
      'linked list corresponding to its preorder. ' +
      '\nRecursive (bottom-up): ' +
      '\n- Recursively flatten left and right subtrees. ' +
      '\n- Splice the flattened left chain between the node and its right chain: ' +
      'node.right = leftChain; walk to the end and append rightChain. ' +
      '\n- node.left = null. ' +
      'Time O(n), space O(h) (recursion). An O(1)-space iterative preorder variant also exists.',
  },
  tags: ['tree', 'flatten', 'linked-list', 'in-place', 'preorder'],
  complexity: { time: 'O(n)', space: 'O(h)' },
};
