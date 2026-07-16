// BST 从有序数组构造（平衡）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'tree-bst-from-sorted',
  categoryId: 'tree',
  title: { zh: '有序数组构造平衡 BST', en: 'Sorted Array to Balanced BST' },
  summary: {
    zh: '把升序数组转成高度平衡的 BST（取中点为根递归构造）。',
    en: 'Convert a sorted ascending array into a height-balanced BST (recurse with the middle element as root).',
  },
  description: {
    zh: '从有序数组构造平衡 BST：build(lo, hi) —— 若 lo > hi 返回 null；mid = (lo + hi) / 2；node = new Node(arr[mid])；node.left = build(lo, mid - 1)；node.right = build(mid + 1, hi)；返回 node。\n\n每次取区间中点为根，左右子树大小差不超过 1，保证高度平衡 O(log n)。复杂度 O(n)。',
    en: 'Sorted array to balanced BST: build(lo, hi) picks mid=(lo+hi)/2 as root, recurses on [lo,mid-1] and [mid+1,hi]. Left and right subtrees differ in size by at most 1, giving O(log n) height. Complexity O(n).',
  },
  tags: ['tree', 'bst', 'construct', 'balanced', 'divide-and-conquer'],
  complexity: { time: 'O(n)', space: 'O(log n)' },
};
