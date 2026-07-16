// Exponential Search · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'exponential-search-impl',
  categoryId: 'searching',
  title: { zh: '指数搜索', en: 'Exponential Search' },
  summary: {
    zh: '步长按 2 的幂倍增定位上界，再在 [i/2, i] 内做二分。',
    en: 'Doubles the bound by powers of two, then binary-searches the [i/2, i] window.',
  },
  description: {
    zh: '指数搜索（Exponential Search，又称 Doubling Search / Galloping Search）在有序数组中查找目标，尤其适合目标位置靠前或数组规模未知的场景。\n\n步骤：从下标 1 开始，i 不断翻倍（1, 2, 4, 8, …），直到 a[i] >= target 或 i >= n；此时目标必在 (i/2, min(i, n)] 内，对该区间做二分查找。\n\n定位边界 O(log p)（p=命中位置），二分 O(log p)，总体 O(log p)。当 p << n 时优于直接二分。空间 O(1)。常用于有序流式 / 无界数据（如 Timsort 中合并小 run 进入大 run 时的 gallop 模式）。',
    en: "Exponential Search (a.k.a. Doubling / Galloping Search) finds a target in a sorted array, ideal for front-loaded targets or unknown array sizes.\n\nProcedure: starting at index 1, double i (1, 2, 4, 8, …) until a[i] >= target or i >= n; the target then lies in (i/2, min(i, n)]. Binary-search that window.\n\nBound location is O(log p) (p = hit position), binary search O(log p), overall O(log p), beating a full binary search when p << n. Space O(1). Used in streaming / unbounded ordered data (e.g. Timsort's gallop mode when merging a small run into a large one).",
  },
  tags: ['searching', 'binary-search', 'exponential', 'ordered'],
  complexity: { time: 'O(log p)', space: 'O(1)' },
};
