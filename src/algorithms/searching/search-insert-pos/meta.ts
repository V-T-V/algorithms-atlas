// 搜索插入位置 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'search-insert-pos',
  categoryId: 'searching',
  title: { zh: '搜索插入位置', en: 'Search Insert Position' },
  summary: {
    zh: '在有序数组中二分找 target 的插入下标并判定是否已存在。',
    en: 'Binary search the insertion index for target and report whether it exists.',
  },
  description: {
    zh:
      '搜索插入位置（Search Insert Position，LeetCode 35）：给定升序数组和 target，' +
      '返回 target 应插入的下标（首个 ≥ target 的位置），同时判定该值是否已存在。' +
      '\n- 本实现返回 `{ pos, exists }`：pos 是 lower bound，exists 表示 arr[pos] === target。' +
      '\n- 用左闭右开区间二分，时间 `O(log n)`，空间 `O(1)`。' +
      '\n适合「有序去重插入」「维护有序数组」等场景。',
    en:
      'Search Insert Position (LeetCode 35): given an ascending array and target, return the index ' +
      'at which target should be inserted (the first position ≥ target) and whether it already exists. ' +
      '\n- This impl returns { pos, exists }: pos is the lower bound; exists is whether arr[pos] === target. ' +
      '\n- Half-open interval binary search; O(log n) time, O(1) space. ' +
      'Useful for "sorted unique insert" and "maintain sorted array".',
  },
  tags: ['searching', 'binary-search', 'lower-bound', 'insertion'],
  complexity: { time: 'O(log n)', space: 'O(1)' },
};
