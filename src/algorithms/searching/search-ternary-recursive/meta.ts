// 三分查找（递归）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'search-ternary-recursive',
  categoryId: 'searching',
  title: { zh: '三分查找（递归）', en: 'Ternary Search (Recursive)' },
  summary: {
    zh: '把搜索区间三等分，在有序数组中递归定位目标。',
    en: 'Split the search interval into thirds and recursively locate the target in a sorted array.',
  },
  description: {
    zh: '递归三分查找：在有序数组中取两个中点：\n```\nm1 = lo + (hi - lo) / 3\nm2 = hi - (hi - lo) / 3\n```\n- target == arr[m1] → 返回 m1\n- target == arr[m2] → 返回 m2\n- target < arr[m1] → 在 [lo, m1-1] 递归\n- arr[m1] < target < arr[m2] → 在 [m1+1, m2-1] 递归\n- target > arr[m2] → 在 [m2+1, hi] 递归\n\n每轮把搜索范围缩到 1/3。复杂度 O(log₃ n)，渐近不如二分但常数上类似。',
    en: 'Recursive ternary search: use two midpoints m1 = lo + (hi-lo)/3 and m2 = hi - (hi-lo)/3. Check equality, then recurse into one of three subranges depending on where target falls. Reduces range to 1/3 per step. Complexity O(log₃ n), asymptotically similar to binary search.',
  },
  tags: ['searching', 'ternary-search', 'recursive', 'divide-and-conquer'],
  complexity: { time: 'O(log n)', space: 'O(log n)' },
};
