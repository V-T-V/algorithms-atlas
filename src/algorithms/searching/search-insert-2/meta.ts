// 查找插入位置 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'search-insert-2',
  categoryId: 'searching',
  title: { zh: '查找插入位置', en: 'Search Insert Position' },
  summary: {
    zh: '找 target 应插入升序数组的位置（保持有序），等价 lower_bound。',
    en: 'Find where to insert target to keep a sorted array ordered; equivalent to lower_bound.',
  },
  description: {
    zh: '查找插入位置：给定升序数组与 target，返回应插入的下标使插入后仍有序。若 target 已存在，插入到其首次出现前（左边界）。这等价于 lower_bound（第一个 >= target 的下标）。时间 O(log n)，空间 O(1)。LeetCode 35 经典题。',
    en: 'Search insert position: given a sorted array and target, return the index where target should be inserted to keep the array sorted. If target already exists, insert before its first occurrence (left boundary). Equivalent to lower_bound (first index with arr[i] >= target). Time O(log n), space O(1). LeetCode 35.',
  },
  tags: ['searching', 'binary-search', 'insert-position', 'sorted'],
  complexity: { time: 'O(log n)', space: 'O(1)' },
};
