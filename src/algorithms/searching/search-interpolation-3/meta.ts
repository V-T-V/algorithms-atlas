// 插值查找 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'search-interpolation-3',
  categoryId: 'searching',
  title: { zh: '插值查找', en: 'Interpolation Search' },
  summary: {
    zh: '按值分布估计位置：pos = lo + (target-a[lo])/(a[hi]-a[hi])*(hi-lo)。',
    en: 'Estimate position by value distribution: pos = lo + (target-a[lo])/(a[hi]-a[lo])*(hi-lo).',
  },
  description: {
    zh: '插值查找（Interpolation Search）改进二分查找：不固定取中点，而是根据 target 在 [a[lo], a[hi]] 中的相对位置估计其下标 pos = lo + (target - a[lo]) / (a[hi] - a[lo]) * (hi - lo)。对均匀分布的数据，每次比较可排除更大比例的元素，期望 O(log log n)。最坏（分布不均）退化为 O(n)。要求数组已排序。',
    en: "Interpolation search improves binary search: instead of always taking the midpoint, it estimates the target's index by its relative position within [a[lo], a[hi]]: pos = lo + (target - a[lo]) / (a[hi] - a[lo]) * (hi - lo). On uniformly-distributed data each comparison eliminates a larger fraction, giving expected O(log log n). Worst case (skewed distribution) degenerates to O(n). Requires a sorted array.",
  },
  tags: ['searching', 'interpolation', 'sorted', 'distribution'],
  complexity: { time: 'O(log log n)', space: 'O(1)' },
};
