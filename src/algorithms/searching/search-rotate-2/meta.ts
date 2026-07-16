// 旋转数组查找（无重复） · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'search-rotate-2',
  categoryId: 'searching',
  title: { zh: '旋转数组查找（无重复）', en: 'Search Rotated Array (No Duplicates)' },
  summary: {
    zh: '在旋转过的升序数组（无重复）中二分查找 target。',
    en: 'Binary search for target in a rotated sorted array with no duplicates.',
  },
  description: {
    zh: '旋转数组查找：一个升序数组在某个枢轴处旋转（如 [0,1,2,3,4] → [3,4,0,1,2]），无重复元素。二分时判断 mid 落在左半有序段还是右半有序段，再判断 target 在有序段内决定收缩方向。时间 O(log n)，空间 O(1)。LeetCode 33。',
    en: 'Rotated-array search: an ascending array rotated at some pivot (e.g. [0,1,2,3,4] → [3,4,0,1,2]) with no duplicates. On each binary step determine whether mid lies in the left-ordered or right-ordered segment, then whether target is within the ordered segment to decide the shrink direction. Time O(log n), space O(1). LeetCode 33.',
  },
  tags: ['searching', 'binary-search', 'rotated', 'sorted'],
  complexity: { time: 'O(log n)', space: 'O(1)' },
};
