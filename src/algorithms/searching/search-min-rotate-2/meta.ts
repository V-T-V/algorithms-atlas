// 旋转数组最小值 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'search-min-rotate-2',
  categoryId: 'searching',
  title: { zh: '旋转数组最小值', en: 'Find Min in Rotated Array' },
  summary: {
    zh: '二分找旋转升序数组中的最小元素下标。',
    en: "Binary search for the minimum element's index in a rotated sorted array.",
  },
  description: {
    zh: '旋转数组最小值：升序数组旋转后（无重复），最小值是旋转点。二分：比较 arr[mid] 与 arr[hi]，若 arr[mid] < arr[hi] 则最小在左半（含 mid）hi=mid；否则在右半 lo=mid+1。收敛时 lo 即最小值下标。时间 O(log n)，空间 O(1)。LeetCode 153。',
    en: 'Minimum in rotated array: after rotating an ascending array (no duplicates), the minimum is the rotation pivot. Binary search: compare arr[mid] with arr[hi]; if arr[mid] < arr[hi] the min is in the left half (including mid), hi=mid; else right half lo=mid+1. When converged, lo is the min index. Time O(log n), space O(1). LeetCode 153.',
  },
  tags: ['searching', 'binary-search', 'rotated', 'minimum'],
  complexity: { time: 'O(log n)', space: 'O(1)' },
};
