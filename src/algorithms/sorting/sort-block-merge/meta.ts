// 块归并排序 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sort-block-merge',
  categoryId: 'sorting',
  title: { zh: '块归并排序', en: 'Block Merge Sort' },
  summary: {
    zh: '把数组分成大小为 √n 的块，逐块排序后再用块级归并，空间 O(1)。',
    en: 'Split the array into blocks of size √n, sort each block, then merge blocks with O(1) extra space.',
  },
  description: {
    zh: '块归并排序（Block Merge Sort，类似 WikiSort/GrailSort 思想的教学简化版）将数组划分为若干个大小约为 √n 的块，先对每块内部排序，再使用一个小型缓冲区在块之间执行原地归并。相比朴素原地归并减少了旋转次数，保持稳定且空间近似常数。本实现展示其分块 + 块内插入排序 + 块间归并的核心流程。',
    en: 'Block Merge Sort (a teaching simplification of WikiSort/GrailSort) divides the array into blocks of about √n, sorts each block internally, then merges blocks in-place using a small buffer. Compared to naive in-place merge it reduces rotations and stays stable with near-constant space. This implementation shows the block + per-block insertion sort + inter-block merge flow.',
  },
  tags: ['sorting', 'merge', 'in-place', 'block'],
  complexity: { time: 'O(n log²n)', space: 'O(1)' },
};
