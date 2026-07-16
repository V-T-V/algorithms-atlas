// 二分查找（递归）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'search-binary-recursive',
  categoryId: 'searching',
  title: { zh: '二分查找（递归）', en: 'Binary Search (Recursive)' },
  summary: {
    zh: '在有序数组中递归地折半查找目标值。',
    en: 'Recursively halve a sorted array to locate a target value.',
  },
  description: {
    zh: '递归二分查找：比较中点 arr[mid] 与目标 target：\n- 相等：返回 mid\n- arr[mid] < target：在右半 [mid+1, hi] 递归\n- arr[mid] > target：在左半 [lo, mid-1] 递归\n\n前提：数组已升序。找不到返回 -1。复杂度 O(log n)。',
    en: 'Recursive binary search: compare the middle element arr[mid] with target. Equal → return mid; arr[mid]<target → recurse on right half [mid+1, hi]; arr[mid]>target → recurse on left half [lo, mid-1]. Requires sorted ascending array. Returns -1 if not found. Complexity O(log n).',
  },
  tags: ['searching', 'binary-search', 'recursive', 'divide-and-conquer'],
  complexity: { time: 'O(log n)', space: 'O(log n)' },
};
