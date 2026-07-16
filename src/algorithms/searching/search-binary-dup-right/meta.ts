// 二分查找最右位置 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'search-binary-dup-right',
  categoryId: 'searching',
  title: { zh: '二分查找最右位置', en: 'Binary Search Rightmost' },
  summary: {
    zh: '在有重复元素的有序数组中找目标最后出现的位置（upper bound - 1）。',
    en: 'Find the last (rightmost) occurrence of the target in a sorted array with duplicates.',
  },
  description: {
    zh: '二分查找最右位置（upper_bound - 1）：令 lo = 0, hi = n。循环 while lo < hi：mid = (lo + hi) / 2；若 arr[mid] <= target 则 lo = mid + 1，否则 hi = mid。返回 lo，它就是第一个 > target 的位置（upper bound）。若 lo-1 >= 0 且 arr[lo-1] == target，则 lo-1 是最右出现。复杂度 O(log n)。',
    en: 'Binary search rightmost (upper_bound - 1): invariant lo<hi, mid=(lo+hi)/2; if arr[mid]<=target lo=mid+1 else hi=mid. lo is the first index i with arr[i]>target. If lo-1 >= 0 and arr[lo-1]==target then lo-1 is the rightmost occurrence. Complexity O(log n).',
  },
  tags: ['searching', 'binary-search', 'upper-bound', 'duplicates'],
  complexity: { time: 'O(log n)', space: 'O(1)' },
};
