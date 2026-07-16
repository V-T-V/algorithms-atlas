// 指数查找 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'search-exponential-3',
  categoryId: 'searching',
  title: { zh: '指数查找', en: 'Exponential Search' },
  summary: {
    zh: '先以 2 的幂扩大搜索范围定位候选段，再在段内二分。',
    en: 'Gallop by powers of two to bound a candidate range, then binary-search within it.',
  },
  description: {
    zh: '指数查找（Exponential Search / Galloping Search）适合在很大且目标可能靠前的有序数组中查找。先以步长 1, 2, 4, 8, ... 指数扩大下标 bound，直到 arr[bound] >= target（bound 不超过 n）；然后在 [bound/2, min(bound, n)) 内做标准二分查找。时间 O(log k)，k 为目标位置（若目标靠前比二分更快）。空间 O(1)。',
    en: 'Exponential search (galloping search) suits very large sorted arrays where the target may be near the front. First gallop the index by powers of two (1, 2, 4, 8, ...) until arr[bound] >= target (bound capped at n), then standard binary search within [bound/2, min(bound, n)). Time O(log k) where k is the target position (faster than binary search when the target is near the front). Space O(1).',
  },
  tags: ['searching', 'exponential', 'binary-search', 'sorted', 'unbounded'],
  complexity: { time: 'O(log k)', space: 'O(1)' },
};
