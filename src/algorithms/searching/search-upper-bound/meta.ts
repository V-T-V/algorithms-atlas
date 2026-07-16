// 上界二分查找 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'search-upper-bound',
  categoryId: 'searching',
  title: { zh: '上界二分查找', en: 'Upper Bound Binary Search' },
  summary: {
    zh: '找第一个 > target 的下标（C++ upper_bound 语义）。',
    en: 'Find the first index with arr[i] > target (C++ upper_bound semantics).',
  },
  description: {
    zh: '上界（upper_bound）二分查找：在升序数组中找第一个满足 arr[i] > target 的下标 i。若所有元素都 <= target，返回 n。与 lower_bound 仅差一个比较方向。常与 lower_bound 配合确定 target 的值域范围 [lower, upper)。时间 O(log n)，空间 O(1)。',
    en: 'Upper-bound binary search: find the first index i with arr[i] > target in a sorted array. If all elements are <= target, return n. Differs from lower_bound only in the comparison direction. Often paired with lower_bound to determine the value range [lower, upper). Time O(log n), space O(1).',
  },
  tags: ['searching', 'binary-search', 'sorted', 'upper-bound'],
  complexity: { time: 'O(log n)', space: 'O(1)' },
};
