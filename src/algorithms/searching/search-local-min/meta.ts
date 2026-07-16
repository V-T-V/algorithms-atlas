// 查找局部最小 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'search-local-min',
  categoryId: 'searching',
  title: { zh: '查找局部最小', en: 'Find Local Minimum' },
  summary: {
    zh: '二分找比相邻元素都小的局部最小（互异数组），O(log n)。',
    en: 'Binary search for a local minimum (smaller than neighbors) in a distinct array, O(log n).',
  },
  description: {
    zh: '局部最小查找：互异数组中找一个比左右邻居都小的元素（边界只需比唯一邻居小）。二分：比较 arr[mid] 与 arr[mid+1]，若 arr[mid] < arr[mid+1] 则左半（含 mid）必有局部最小 hi=mid，否则右半 lo=mid+1。时间 O(log n)，空间 O(1)。',
    en: 'Local-minimum search: find an element smaller than both neighbors in a distinct array (boundaries need only beat the single neighbor). Binary search: compare arr[mid] with arr[mid+1]; if arr[mid] < arr[mid+1] the left half (including mid) has a local min hi=mid, else right half lo=mid+1. Time O(log n), space O(1).',
  },
  tags: ['searching', 'binary-search', 'local-minimum', 'unsorted'],
  complexity: { time: 'O(log n)', space: 'O(1)' },
};
