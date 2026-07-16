// 二分查找最左位置 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'search-binary-dup-left',
  categoryId: 'searching',
  title: { zh: '二分查找最左位置', en: 'Binary Search Leftmost' },
  summary: {
    zh: '在有重复元素的有序数组中找目标首次出现的位置（lower bound）。',
    en: 'Find the first (leftmost) occurrence of the target in a sorted array with duplicates (lower bound).',
  },
  description: {
    zh: '二分查找最左位置（lower_bound）：令 lo = 0, hi = n。循环 while lo < hi：mid = (lo + hi) / 2；若 arr[mid] < target 则 lo = mid + 1，否则 hi = mid。返回 lo，它就是第一个 >= target 的位置。若 arr[lo] != target 表示不存在。用于找重复元素的最左索引或插入位置。复杂度 O(log n)。',
    en: 'Binary search leftmost (lower_bound): invariant lo<hi, mid=(lo+hi)/2; if arr[mid]<target lo=mid+1 else hi=mid. Returns the first index i with arr[i]>=target (or i==n if all smaller). If arr[lo]!=target the target is absent. Complexity O(log n).',
  },
  tags: ['searching', 'binary-search', 'lower-bound', 'duplicates'],
  complexity: { time: 'O(log n)', space: 'O(1)' },
};
