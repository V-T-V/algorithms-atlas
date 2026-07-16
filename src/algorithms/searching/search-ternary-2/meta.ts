// 三分查找 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'search-ternary-2',
  categoryId: 'searching',
  title: { zh: '三分查找', en: 'Ternary Search' },
  summary: {
    zh: '每次取两个中点把区间三等分，比较两次再缩到三分之一段。',
    en: 'Pick two midpoints to trisect the range; two comparisons then shrink to one third.',
  },
  description: {
    zh: '三分查找（Ternary Search）是二分的变体：每次取 mid1 = lo + (hi-lo)/3 与 mid2 = hi - (hi-lo)/3 两个中点，比较 target 与 arr[mid1]、arr[mid2]，把搜索区间缩到三个子段之一。每轮比较 2 次但区间缩到 1/3。时间复杂度 O(log_3 n)，渐近仍为 O(log n)，常数通常不如二分优，但概念清晰。要求数组已排序。',
    en: 'Ternary search is a binary variant: each step pick two midpoints mid1 = lo + (hi-lo)/3 and mid2 = hi - (hi-lo)/3, compare target with arr[mid1] and arr[mid2], then narrow into one of three sub-segments. Two comparisons per round shrink the range to 1/3. Time O(log_3 n), still O(log n) asymptotically; the constant is usually worse than binary but the idea is clear. Requires a sorted array.',
  },
  tags: ['searching', 'ternary', 'sorted'],
  complexity: { time: 'O(log n)', space: 'O(1)' },
};
