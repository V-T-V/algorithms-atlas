// 斐波那契查找（变体）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'search-fibonacci-2',
  categoryId: 'searching',
  title: { zh: '斐波那契查找（变体）', en: 'Fibonacci Search (Variant)' },
  summary: {
    zh: '用斐波那契数列划分区间，类似二分但用加法代替除法。',
    en: 'Partition the interval using Fibonacci numbers; like binary search but uses addition instead of division.',
  },
  description: {
    zh: '斐波那契查找：找最小的 F(k) ≥ n+1，把数组扩展（概念上补到最后元素的值）到 F(k)-1。\n\n每步取 mid = lo + F(k-2) - 1：\n- arr[mid] == target → 返回（若索引 ≥ n，返回 n-1）\n- arr[mid] > target → 在左段 [lo, mid-1] 查找，k -= 2\n- arr[mid] < target → 在右段 [mid+1, hi] 查找，lo = mid+1，k -= 1\n\n优点：只用加减法，避免除法。复杂度 O(log n)。',
    en: 'Fibonacci search: find smallest F(k) ≥ n+1, conceptually extend the array to F(k)-1. Take mid = lo + F(k-2) - 1; recurse left (k-=2) if arr[mid]>target, recurse right (k-=1, lo=mid+1) if arr[mid]<target. Uses only addition/subtraction (no division). Complexity O(log n).',
  },
  tags: ['searching', 'fibonacci-search', 'divide-and-conquer'],
  complexity: { time: 'O(log n)', space: 'O(1)' },
};
