// 查找峰值（二分） · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'search-peak-2',
  categoryId: 'searching',
  title: { zh: '查找峰值（二分）', en: 'Find Peak Element (Binary)' },
  summary: {
    zh: '二分找任意一个峰值：比相邻元素大的元素，O(log n)。',
    en: 'Binary search for any peak (greater than its neighbors) in O(log n).',
  },
  description: {
    zh: '峰值查找：数组中一个元素若大于其相邻元素即为峰值（边界元素只需大于唯一邻居）。用二分可找任意一个峰值：比较 mid 与 mid+1，若 arr[mid] < arr[mid+1] 则右侧必有峰值（向右 lo=mid+1），否则左侧（含 mid）必有峰值（hi=mid）。时间 O(log n)，空间 O(1)。LeetCode 162。',
    en: 'Peak finding: an element greater than its neighbors is a peak (boundary elements need only beat their single neighbor). Binary search finds any peak: compare mid with mid+1; if arr[mid] < arr[mid+1] a peak must exist on the right (lo=mid+1), else one exists on the left including mid (hi=mid). Time O(log n), space O(1). LeetCode 162.',
  },
  tags: ['searching', 'binary-search', 'peak', 'unsorted'],
  complexity: { time: 'O(log n)', space: 'O(1)' },
};
