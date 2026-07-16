// 查找单一元素 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'search-single-elem-2',
  categoryId: 'searching',
  title: { zh: '查找单一元素', en: 'Single Element in Sorted Array' },
  summary: {
    zh: '二分找有序数组中唯一只出现一次的元素（其余成对）。',
    en: 'Binary search for the only once-occurring element in a sorted array (others in pairs).',
  },
  description: {
    zh: '单一元素：给定一个有序数组，其中除一个元素外其余都恰好出现两次，找那个单一元素。利用「成对元素首下标偶/奇性」：二分 mid，若 mid 偶且 arr[mid]==arr[mid+1]（或 mid 奇且 arr[mid]==arr[mid-1]）说明单一元素在右半，否则左半。时间 O(log n)，空间 O(1)。LeetCode 540。',
    en: "Single element: given a sorted array where every element except one appears exactly twice, find that single element. Exploit the even/odd parity of paired elements' first indices: binary search mid; if mid is even and arr[mid]==arr[mid+1] (or mid odd and arr[mid]==arr[mid-1]) the single is in the right half, else the left. Time O(log n), space O(1). LeetCode 540.",
  },
  tags: ['searching', 'binary-search', 'single', 'xor-pattern'],
  complexity: { time: 'O(log n)', space: 'O(1)' },
};
