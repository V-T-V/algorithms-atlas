// 指数查找（变体）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'search-exponential-2',
  categoryId: 'searching',
  title: { zh: '指数查找（变体）', en: 'Exponential Search (Variant)' },
  summary: {
    zh: '先倍增区间定位边界，再在小区间内二分查找。',
    en: 'Find the bounding range by doubling, then binary search within the small range.',
  },
  description: {
    zh: '指数查找（exponential search / galloping search 的扩展版）：\n1. 从 bound = 1 开始，bound *= 2，直到 arr[bound] >= target 或越界\n2. 在 [bound/2, min(bound, n-1)] 上做二分查找\n\n适合无界/非常大且 target 在前段的有序数组。复杂度 O(log n)，定位阶段 O(log target_index)。',
    en: 'Exponential search: (1) start with bound=1, double it until arr[bound] >= target or out of bounds; (2) binary search in [bound/2, min(bound, n-1)]. Suited to unbounded or very large sorted arrays where the target lies near the front. Complexity O(log n); the location phase is O(log target_index).',
  },
  tags: ['searching', 'exponential-search', 'binary-search', 'unbounded'],
  complexity: { time: 'O(log n)', space: 'O(1)' },
};
