// Binary Insertion Sort · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'insertion-sort-binary',
  categoryId: 'sorting',
  title: { zh: '二分插入排序', en: 'Binary Insertion Sort' },
  summary: {
    zh: '用二分查找定位插入点，减少比较次数到 O(log n) 每元素。',
    en: 'Locates each insertion point with binary search, cutting compares to O(log n) per element.',
  },
  description: {
    zh: '二分插入排序（Binary Insertion Sort）是插入排序的优化版本：对每个待插入元素 a[i]，在已排序段 a[0..i-1] 中用二分查找确定其应插入的位置，再把该位置到 i-1 的元素整体右移一位。比较次数降为 O(n log n)，但搬移仍是 O(n²)，故总体仍为 O(n²)；当单次比较代价较高（如长字符串）时收益明显。稳定，原地，空间 O(1)。',
    en: 'Binary Insertion Sort improves insertion sort by binary-searching the sorted prefix a[0..i-1] for each new element a[i], then shifting the tail right by one. Comparisons drop to O(n log n) but shifts remain O(n²), so overall time is still O(n²); the win is large when individual comparisons are costly (e.g. long strings). Stable, in-place, space O(1).',
  },
  tags: ['sorting', 'stable', 'in-place', 'insertion', 'binary-search'],
  complexity: { time: 'O(n²)', space: 'O(1)' },
  attributes: { stable: 'true' },
};
