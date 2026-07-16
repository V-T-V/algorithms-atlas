// 两个有序数组中位数 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'search-median-two',
  categoryId: 'searching',
  title: { zh: '两个有序数组中位数', en: 'Median of Two Sorted Arrays' },
  summary: {
    zh: '对较短数组二分切分点，使左右两半元素数相等且边界有序，O(log(min))。',
    en: 'Binary search the partition on the shorter array so both halves are equal-sized and ordered; O(log(min)).',
  },
  description: {
    zh: '两有序数组中位数：经典 O(log(min(m,n))) 算法。在较短数组 A 上二分切分点 i，则 B 的切分点 j = (m+n+1)/2 - i。检查 A[i-1]<=B[j] 且 B[j-1]<=A[i] 即找到正确切分，中位数由切分两侧边界决定。奇偶总数分别处理。LeetCode 4。',
    en: 'Median of two sorted arrays: the classic O(log(min(m,n))) algorithm. Binary search the partition point i on the shorter array A; then B partition j = (m+n+1)/2 - i. Check A[i-1]<=B[j] and B[j-1]<=A[i] to find the correct partition; the median is decided by the partition boundary values, handling odd/even totals separately. LeetCode 4.',
  },
  tags: ['searching', 'binary-search', 'median', 'two-arrays'],
  complexity: { time: 'O(log min(m,n))', space: 'O(1)' },
};
