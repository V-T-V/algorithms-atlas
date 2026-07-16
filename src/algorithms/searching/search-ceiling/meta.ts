// 查找天花板值 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'search-ceiling',
  categoryId: 'searching',
  title: { zh: '查找天花板值', en: 'Find Ceiling' },
  summary: {
    zh: '在升序数组中找最小的 >= target 的元素下标，不存在返回 -1。',
    en: 'Find the smallest index with arr[i] >= target in a sorted array; -1 if none.',
  },
  description: {
    zh: '天花板查找（Ceiling）：在升序数组中找最小的满足 arr[i] >= target 的下标 i。若所有元素都 < target 返回 -1。等价于 lower_bound，但未找到时返回 -1 而非 n。二分实现：ans=-1，mid 命中 >= target 则 ans=mid 向左 hi=mid-1，否则向右。时间 O(log n)，空间 O(1)。',
    en: 'Ceiling search: find the smallest index i with arr[i] >= target in a sorted array. If all elements are < target return -1. Equivalent to lower_bound but returns -1 instead of n when not found. Binary implementation: ans=-1; if arr[mid] >= target set ans=mid and go left (hi=mid-1), else go right. Time O(log n), space O(1).',
  },
  tags: ['searching', 'binary-search', 'ceiling', 'sorted'],
  complexity: { time: 'O(log n)', space: 'O(1)' },
};
