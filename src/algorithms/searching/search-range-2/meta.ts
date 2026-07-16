// 查找区间 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'search-range-2',
  categoryId: 'searching',
  title: { zh: '查找区间', en: 'Search Range' },
  summary: {
    zh: '返回 target 在升序数组中首次与末次出现的下标区间 [-1,-1] 表示无。',
    en: 'Return the [first, last] indices of target in a sorted array; [-1,-1] if absent.',
  },
  description: {
    zh: '查找区间：在含重复的升序数组中找 target 的首次与末次出现下标 [first, last]，不存在返回 [-1, -1]。用两次二分：一次找最左命中（命中后继续向左 hi=mid-1），一次找最右命中（命中后继续向右 lo=mid+1）。时间 O(log n)，空间 O(1)。LeetCode 34。',
    en: 'Search range: find the first and last index of target in a sorted array with duplicates, returning [first, last]; [-1,-1] if absent. Two binary searches: one for the leftmost hit (on a hit keep going left, hi=mid-1), one for the rightmost hit (on a hit keep going right, lo=mid+1). Time O(log n), space O(1). LeetCode 34.',
  },
  tags: ['searching', 'binary-search', 'range', 'sorted'],
  complexity: { time: 'O(log n)', space: 'O(1)' },
};
