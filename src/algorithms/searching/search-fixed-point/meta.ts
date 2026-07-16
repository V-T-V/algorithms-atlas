// 查找不动点 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'search-fixed-point',
  categoryId: 'searching',
  title: { zh: '查找不动点', en: 'Find Fixed Point' },
  summary: {
    zh: '升序互异数组中找 i 使 arr[i] == i，二分 O(log n)。',
    en: 'Find i with arr[i] == i in a sorted distinct array via binary search, O(log n).',
  },
  description: {
    zh: '不动点查找：升序且元素互异的数组中找下标 i 使 arr[i] == i。利用互异性：若 arr[mid] < mid 则左半必无解（arr[i] <= arr[mid]-(mid-i) < i），向右 lo=mid+1；arr[mid] > mid 则右半必无解，向左 hi=mid-1。时间 O(log n)，空间 O(1)。',
    en: 'Fixed-point search: find index i with arr[i] == i in a sorted array with distinct elements. By distinctness: if arr[mid] < mid the left half has no solution (arr[i] <= arr[mid]-(mid-i) < i), go right lo=mid+1; if arr[mid] > mid the right half has no solution, go left hi=mid-1. Time O(log n), space O(1).',
  },
  tags: ['searching', 'binary-search', 'fixed-point', 'sorted'],
  complexity: { time: 'O(log n)', space: 'O(1)' },
};
