// 快速排序（三数取中） · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sort-quick-median3',
  categoryId: 'sorting',
  title: { zh: '快速排序（三数取中）', en: 'Quick Sort (Median-of-Three)' },
  summary: {
    zh: '用首/中/尾三数中位数做 pivot，避免最坏情况，递归改迭代栈。',
    en: 'Use the median of first/middle/last as pivot to avoid worst case; iterative stack.',
  },
  description: {
    zh: '快速排序对已排序输入用首元素做 pivot 会退化到 O(n^2)。三数取中法取 a[lo]、a[mid]、a[hi] 的中位数做 pivot，大幅降低最坏情况概率。本实现把中位数交换到 lo 作为 pivot，再用 Lomuto 分区，递归改为显式栈迭代（避免栈溢出）。平均 O(n log n)，原地，不稳定。',
    en: 'Quicksort with first-element pivot degenerates to O(n^2) on sorted input. Median-of-three picks the median of a[lo], a[mid], a[hi] as pivot, greatly reducing the worst case. This implementation swaps the median to lo as pivot, then partitions (Lomuto) and recurses via an explicit stack (iterative, avoiding stack overflow). Average O(n log n), in-place, unstable.',
  },
  tags: ['sorting', 'comparison', 'in-place', 'divide-and-conquer'],
  complexity: { time: 'O(n log n)', space: 'O(log n)' },
};
