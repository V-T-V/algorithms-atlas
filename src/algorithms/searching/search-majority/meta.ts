// 多数元素（投票法） · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'search-majority',
  categoryId: 'searching',
  title: { zh: '多数元素（投票法）', en: 'Majority Element (Boyer-Moore)' },
  summary: {
    zh: 'Boyer-Moore 投票：维护候选与计数，O(n) O(1) 找出现超过 n/2 次的元素。',
    en: 'Boyer-Moore voting: maintain a candidate and counter; O(n) O(1) for the element appearing more than n/2 times.',
  },
  description: {
    zh: '多数元素：数组中出现次数超过 n/2 的元素（题目保证存在）。Boyer-Moore 投票算法：维护候选 candidate 与计数 count，遍历时若 count=0 则换候选，当前元素等于候选则 count++，否则 count--。最终候选即多数元素。时间 O(n)，空间 O(1)。LeetCode 169。',
    en: 'Majority element: the element appearing more than n/2 times (guaranteed to exist). Boyer-Moore voting: maintain a candidate and count; when count is 0 switch candidate; if the current element equals candidate increment count, else decrement. The final candidate is the majority. Time O(n), space O(1). LeetCode 169.',
  },
  tags: ['searching', 'majority', 'boyer-moore', 'voting'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
