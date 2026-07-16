// 插值搜索迭代版 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'interpolation-search-iter',
  categoryId: 'searching',
  title: { zh: '插值搜索（迭代）', en: 'Interpolation Search (Iterative)' },
  summary: {
    zh: '按值域线性插值估计位置，迭代逼近目标的有序表搜索。',
    en: 'Probe by linear value interpolation, iterate to the target in a sorted table.',
  },
  description: {
    zh:
      '插值搜索（迭代版）：对**均匀分布的有序数组**，用线性插值估计目标所在位置：' +
      '\n`pos = lo + (target − a[lo]) · (hi − lo) / (a[hi] − a[lo])`' +
      '\n相比二分的固定中点，插值在均匀数据上每次可去掉一大部分区间，平均 `O(log log n)`。' +
      '\n非均匀分布退化为 `O(n)`。要求数组升序。',
    en:
      'Interpolation search (iterative): for a uniformly distributed sorted array, probe at the ' +
      'linearly interpolated position: ' +
      '\n`pos = lo + (target − a[lo]) · (hi − lo) / (a[hi] − a[lo])`. ' +
      "Vs. binary search's fixed midpoint, interpolation can prune a large slice each step on uniform data, " +
      'averaging O(log log n). Degrades to O(n) on skewed distributions. Requires ascending order.',
  },
  tags: ['searching', 'sorted', 'interpolation', 'iterative'],
  complexity: { time: 'O(log log n)', space: 'O(1)' },
};
