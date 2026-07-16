// BST 恢复（变体）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'tree-bst-recover-2',
  categoryId: 'tree',
  title: { zh: 'BST 恢复（变体）', en: 'Recover Binary Search Tree' },
  summary: {
    zh: '一棵 BST 中恰好两个节点被错换，通过中序遍历找出并交换它们的值。',
    en: 'Exactly two nodes of a BST were swapped; find and swap them back via in-order traversal.',
  },
  description: {
    zh: '恢复 BST（两个节点错位）：\n1. 中序遍历应严格递增。若有两个节点被交换，中序序列会出现 1 处或 2 处逆序\n2. 找第一个逆序对的前者 first 和最后一个逆序对的后者 second\n3. 交换 first 和 second 的值\n\n具体：扫描中序，记录 prev；若 prev.value > node.value：\n- 若 first 未设：first = prev\n- second = node\n\n最后交换 first、second。O(n) 时间 O(h) 空间。',
    en: 'Recover BST (two swapped nodes): in-order should be strictly increasing. Two swapped nodes cause one or two inversions. Scan in-order tracking prev; if prev.value>node.value, first = prev (first time), second = node (last time). Swap first and second. O(n) time, O(h) space.',
  },
  tags: ['tree', 'bst', 'recover', 'inorder', 'binary-search-tree'],
  complexity: { time: 'O(n)', space: 'O(h)' },
};
