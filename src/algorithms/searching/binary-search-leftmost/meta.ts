// 最左二分 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'binary-search-leftmost',
  categoryId: 'searching',
  title: { zh: '最左二分', en: 'Leftmost Binary Search' },
  summary: {
    zh: '在含重复的有序数组中二分找等于 target 的最左下标。',
    en: 'Binary search the leftmost index equal to target in a sorted array with duplicates.',
  },
  description: {
    zh:
      '最左二分（Leftmost Binary Search）：在升序（可含重复）数组中找**等于 target 的最左下标**，' +
      '不存在返回 -1。' +
      '\n- 用「找到等于即记录答案并继续向左」的二分：' +
      '\n  当 a[mid] ≥ target 时 hi=mid；当 a[mid] < target 时 lo=mid+1。' +
      '\n- 收敛后检查 a[lo] 是否等于 target。' +
      '\n时间 `O(log n)`，空间 `O(1)`。是统计、范围查询的基础构件。',
    en:
      'Leftmost Binary Search: in an ascending array (with duplicates) find the leftmost index equal to ' +
      'target, returning -1 if absent. ' +
      '\n- A binary search that "records the answer on equality and keeps going left": ' +
      '\n  when a[mid] ≥ target, set hi=mid; when a[mid] < target, set lo=mid+1. ' +
      '\n- After convergence, check whether a[lo] equals target. ' +
      'O(log n) time, O(1) space. A building block for counting and range queries.',
  },
  tags: ['searching', 'binary-search', 'duplicates', 'leftmost'],
  complexity: { time: 'O(log n)', space: 'O(1)' },
};
