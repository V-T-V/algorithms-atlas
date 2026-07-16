// 循环缓冲排序 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sort-circle-buffer',
  categoryId: 'sorting',
  title: { zh: '循环缓冲排序', en: 'Circle Buffer Sort' },
  summary: {
    zh: '用环形缓冲区实现双缓冲归并，原地完成两段有序子序列的合并。',
    en: 'Merge two sorted runs using a circular buffer as a rotating swap area, in-place.',
  },
  description: {
    zh: '循环缓冲排序在归并排序的基础上，使用一个固定大小 k 的环形缓冲区作为交换区域，实现「接近原地」的两段有序子序列合并。当一个元素需要跨越较长距离移动时，先暂存进缓冲区，再在合适时机回填。它降低了归并排序的额外空间占用，常用于外部排序的内部归并步骤。',
    en: 'Circle Buffer Sort merges two sorted runs using a fixed-size circular buffer as a rotating swap area, achieving near in-place merge. When an element must move far, it is staged in the buffer and written back later, reducing the auxiliary space of merge sort. It is often used as the internal-merge step of external sorting.',
  },
  tags: ['sorting', 'merge', 'in-place', 'buffer'],
  complexity: { time: 'O(n²)', space: 'O(k)' },
};
