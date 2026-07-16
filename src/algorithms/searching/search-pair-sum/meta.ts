// 两数之和（有序双指针） · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'search-pair-sum',
  categoryId: 'searching',
  title: { zh: '两数之和（有序双指针）', en: 'Two Sum (Sorted Two-Pointer)' },
  summary: {
    zh: '升序数组用左右双指针找和等于 target 的一对。',
    en: 'Two-pointer scan on a sorted array to find a pair summing to target.',
  },
  description: {
    zh: '两数之和（有序版）：升序数组中找两个数之和等于 target。双指针法：lo=0, hi=n-1，若 arr[lo]+arr[hi] < target 则 lo++，> target 则 hi--，相等即返回。时间 O(n)，空间 O(1)。比哈希法省空间。LeetCode 167。',
    en: 'Two sum (sorted): find two numbers in a sorted array summing to target. Two-pointer: lo=0, hi=n-1; if arr[lo]+arr[hi] < target lo++, if > target hi--, equal returns. Time O(n), space O(1). More space-efficient than the hash approach. LeetCode 167.',
  },
  tags: ['searching', 'two-pointer', 'pair-sum', 'sorted'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
