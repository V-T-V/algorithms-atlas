// 查找地板值 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'search-floor',
  categoryId: 'searching',
  title: { zh: '查找地板值', en: 'Find Floor' },
  summary: {
    zh: '在升序数组中找最大的 <= target 的元素下标，不存在返回 -1。',
    en: 'Find the largest index with arr[i] <= target in a sorted array; -1 if none.',
  },
  description: {
    zh: '地板查找（Floor）：在升序数组中找最大的满足 arr[i] <= target 的下标 i。若所有元素都 > target 返回 -1。用二分：lo=0, hi=n-1, ans=-1，mid 命中 <= target 则 ans=mid 并向右 lo=mid+1，否则向左。时间 O(log n)，空间 O(1)。常用于离散化、找前驱。',
    en: 'Floor search: find the largest index i with arr[i] <= target in a sorted array. If all elements are > target return -1. Use binary search: lo=0, hi=n-1, ans=-1; if arr[mid] <= target set ans=mid and go right (lo=mid+1), else go left. Time O(log n), space O(1). Useful for discretization and finding predecessors.',
  },
  tags: ['searching', 'binary-search', 'floor', 'sorted'],
  complexity: { time: 'O(log n)', space: 'O(1)' },
};
