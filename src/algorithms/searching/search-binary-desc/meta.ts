// 二分查找（降序数组） · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'search-binary-desc',
  categoryId: 'searching',
  title: { zh: '二分查找（降序数组）', en: 'Binary Search (Descending Array)' },
  summary: {
    zh: '在降序排列的数组上做二分查找，比较方向与升序相反。',
    en: 'Binary search on a descending-sorted array, with reversed comparison directions.',
  },
  description: {
    zh: '二分查找通常假设升序。本变体处理降序数组：仍取中点 mid，但当 arr[mid] < target 时向左半区收缩（hi = mid - 1），arr[mid] > target 时向右半区（lo = mid + 1），与升序版恰好相反。时间 O(log n)，空间 O(1)。适用于按降序存储的数据。',
    en: 'Binary search usually assumes ascending order. This variant handles descending arrays: still take the midpoint, but when arr[mid] < target shrink into the left half (hi = mid - 1) and when arr[mid] > target shrink into the right half (lo = mid + 1), the reverse of the ascending version. Time O(log n), space O(1). For data stored in descending order.',
  },
  tags: ['searching', 'binary-search', 'descending', 'sorted'],
  complexity: { time: 'O(log n)', space: 'O(1)' },
};
