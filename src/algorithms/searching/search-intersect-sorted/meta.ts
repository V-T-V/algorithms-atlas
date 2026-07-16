// 有序数组交集 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'search-intersect-sorted',
  categoryId: 'searching',
  title: { zh: '有序数组交集', en: 'Intersection of Sorted Arrays' },
  summary: {
    zh: '双指针扫描两个升序数组找共同元素。',
    en: 'Two-pointer scan of two sorted arrays for common elements.',
  },
  description: {
    zh: '有序数组交集：两个升序数组找共同元素（去重）。双指针 lo1, lo2 同时前进：相等则加入结果（并跳过重复），不等则较小方前进。时间 O(m+n)，空间 O(1)（不计结果）。LeetCode 349/350 变体。',
    en: 'Sorted-array intersection: find common elements (deduped) of two ascending arrays. Two pointers advance together: on equality add to result (skipping duplicates), else advance the smaller side. Time O(m+n), space O(1) excluding the result. LeetCode 349/350 variant.',
  },
  tags: ['searching', 'two-pointer', 'intersection', 'sorted'],
  complexity: { time: 'O(m+n)', space: 'O(1)' },
};
