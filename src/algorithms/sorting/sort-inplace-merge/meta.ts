// 原地归并排序 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sort-inplace-merge',
  categoryId: 'sorting',
  title: { zh: '原地归并排序', en: 'In-place Merge Sort' },
  summary: {
    zh: '通过手摇算法（三段反转）在不申请额外数组的情况下原地合并两段有序序列。',
    en: 'Merge two sorted runs in-place using a three-block rotation (reverse-based) technique.',
  },
  description: {
    zh: '原地归并排序在传统归并排序基础上，使用「手摇算法」（block swap by reversal）合并相邻的两段有序子数组，全程仅需 O(1) 额外空间。核心：要把左段中大于右段首元素的部分与右段旋转对调，等价于反转三段子区间。时间复杂度因旋转上升至 O(n²)，但空间为常数，适合内存受限场景。',
    en: 'In-place merge sort uses the hand-crank algorithm (block swap by reversal) to merge adjacent sorted subarrays using only O(1) extra space. The core idea is to rotate the part of the left run that is greater than the right run head with the right run, implemented by reversing three sub-ranges. Time rises to O(n²) due to rotations, but space is constant, suitable for memory-constrained settings.',
  },
  tags: ['sorting', 'merge', 'in-place', 'divide-and-conquer'],
  complexity: { time: 'O(n²)', space: 'O(1)' },
};
