// 寻找峰值（变体）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'search-peak-find-2',
  categoryId: 'searching',
  title: { zh: '寻找峰值（变体）', en: 'Find Peak Element (Variant)' },
  summary: {
    zh: '用二分在无序数组中 O(log n) 找到一个峰值（比相邻元素大）。',
    en: 'Use binary search to find a peak element (greater than neighbors) in an unsorted array in O(log n).',
  },
  description: {
    zh: '峰值元素：arr[i] 满足 arr[i] >= arr[i-1] 且 arr[i] >= arr[i+1]（边界只需比一侧大）。\n\n二分思路：\n1. mid = (lo+hi)/2\n2. 若 arr[mid] < arr[mid+1]：右侧必有峰值，lo = mid+1\n3. 否则：左侧（含 mid）必有峰值，hi = mid\n4. lo == hi 时即为峰值\n\n利用「上升方向必有峰」性质，O(log n)。返回任一峰值即可。',
    en: 'Peak element: arr[i] with arr[i]>=arr[i-1] and arr[i]>=arr[i+1] (boundary only one side). Binary search: mid=(lo+hi)/2; if arr[mid]<arr[mid+1] there must be a peak on the right (lo=mid+1); else a peak is on the left including mid (hi=mid). When lo==hi it is a peak. Uses the "ascending side has a peak" property. O(log n).',
  },
  tags: ['searching', 'peak', 'binary-search', 'unsorted'],
  complexity: { time: 'O(log n)', space: 'O(1)' },
};
