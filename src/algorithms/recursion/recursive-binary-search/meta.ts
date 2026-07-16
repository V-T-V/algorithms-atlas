// 递归二分查找 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'recursive-binary-search',
  categoryId: 'recursion',
  title: { zh: '递归二分查找', en: 'Recursive Binary Search' },
  summary: {
    zh: '在有序数组中递归折半查找目标，每步把区间减半。',
    en: 'Recursively halve the search interval to locate a target in a sorted array.',
  },
  description: {
    zh: '递归二分查找：在已排序数组 a[lo..hi] 中找目标 target。取中点 mid = (lo+hi)>>1：\n- 若 a[mid] === target，返回 mid\n- 若 target < a[mid]，递归左半 [lo, mid−1]\n- 否则递归右半 [mid+1, hi]\n- 若 lo > hi，返回 −1（未找到）\n\n时间 O(log n)，递归深度 O(log n)。',
    en: 'Recursive binary search on a sorted array: mid = (lo+hi)>>1; if a[mid] equals target return mid; if smaller recurse left [lo,mid-1]; else recurse right [mid+1,hi]; if lo>hi return -1. O(log n) time and depth.',
  },
  tags: ['recursion', 'binary-search', 'searching', 'divide-and-conquer'],
  complexity: { time: 'O(log n)', space: 'O(log n)' },
};
