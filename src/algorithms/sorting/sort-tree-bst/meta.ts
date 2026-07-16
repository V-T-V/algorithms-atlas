// 树排序（BST 中序） · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sort-tree-bst',
  categoryId: 'sorting',
  title: { zh: '树排序（BST 中序）', en: 'Tree Sort (BST In-Order)' },
  summary: {
    zh: '依次插入 BST，中序遍历得有序序列；本版先排序去重再平衡建树。',
    en: 'Insert into a BST, in-order traverse for sorted output; this version builds a balanced tree from sorted unique values.',
  },
  description: {
    zh: '树排序（Tree Sort）把元素逐个插入二叉搜索树，再中序遍历得到有序序列。朴素 BST 对已排序输入退化为链表 O(n^2)。本实现先去重排序后递归地从中点建平衡 BST，再中序遍历，避免退化。建树 O(n log n)，中序 O(n)，整体 O(n log n)。稳定与否取决于实现，本版基于值排序，对相等值保留首次出现顺序。',
    en: 'Tree sort inserts elements into a binary search tree one by one, then in-order traversal yields sorted output. A naive BST degenerates to a linked list on sorted input (O(n^2)). This implementation de-duplicates, sorts, then recursively builds a balanced BST from the midpoint, avoiding degeneration. Building O(n log n), traversal O(n), overall O(n log n).',
  },
  tags: ['sorting', 'comparison', 'bst', 'tree'],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
