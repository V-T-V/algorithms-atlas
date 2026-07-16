// Gallop Search · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'gallop-search-impl',
  categoryId: 'searching',
  title: { zh: '飞驰搜索', en: 'Gallop Search' },
  summary: {
    zh: '以 2 的幂指数倍增步长飞驰定位候选区间，再在区间内二分。',
    en: 'Doubles the step exponentially to gallop into a candidate window, then binary-searches it.',
  },
  description: {
    zh: '飞驰搜索（Gallop Search / Exponential Search 的一种变体）适用于在有序数组中查找目标，尤其当目标位置靠前、不知道数组规模（如流式 / 不可随机访问尾部）时。\n\n步骤：从下标 0 开始，步长按 1, 2, 4, 8, … 倍增地「飞驰」，直到 a[step] >= target 或越界；此时目标必落在上一区间 [prev, step) 内。再对该区间做二分查找。\n\n定位区间 O(log p)（p = 命中位置），二分 O(log p)，总体 O(log p)，比直接对全长二分（O(log n)）更快地命中靠前目标。空间 O(1)。',
    en: 'Gallop Search (a variant of exponential search) finds a target in a sorted array, and shines when the target is near the front, or when the array size is unknown (streaming / no random access to the tail).\n\nProcedure: starting at index 0, gallop with step sizes 1, 2, 4, 8, … until a[step] >= target or out of range; the target then lies in [prev, step). Binary-search that window.\n\nWindow location is O(log p) (p = hit position), binary search O(log p), overall O(log p) — faster than a full O(log n) binary search for front-loaded hits. Space O(1).',
  },
  tags: ['searching', 'binary-search', 'exponential', 'ordered'],
  complexity: { time: 'O(log p)', space: 'O(1)' },
};
