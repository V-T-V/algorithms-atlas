// 二分查找（迭代）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'search-binary-iterative',
  categoryId: 'searching',
  title: { zh: '二分查找（迭代）', en: 'Binary Search (Iterative)' },
  summary: {
    zh: '在有序数组中用 while 循环折半查找目标值。',
    en: 'Iteratively halve a sorted array with a while loop to locate a target value.',
  },
  description: {
    zh: '迭代二分查找：维护 [lo, hi]，循环中取 mid = (lo+hi)/2：\n- arr[mid] == target → 返回 mid\n- arr[mid] < target → lo = mid + 1\n- arr[mid] > target → hi = mid - 1\n\n前提：数组已升序。空间 O(1)，时间 O(log n)。',
    en: 'Iterative binary search: maintain [lo, hi]; mid=(lo+hi)/2; equal → return mid; arr[mid]<target → lo=mid+1; arr[mid]>target → hi=mid-1. Requires ascending sorted array. Space O(1), time O(log n).',
  },
  tags: ['searching', 'binary-search', 'iterative'],
  complexity: { time: 'O(log n)', space: 'O(1)' },
};
