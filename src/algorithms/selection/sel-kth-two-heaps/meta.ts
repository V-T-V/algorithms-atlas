// 双堆第 k · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sel-kth-two-heaps',
  categoryId: 'selection',
  title: { zh: '双堆第 k（动态中位数）', en: 'Two-Heap k-th (Running Median)' },
  summary: {
    zh: '大顶堆+小顶堆维护前半与后半，支持流式插入求中位数。',
    en: 'A max-heap + min-heap split the lower/upper halves to support streaming medians.',
  },
  description: {
    zh: '双堆法维护中位数/第 k：lo（大顶堆）存较小一半，hi（小顶堆）存较大一半，保持 size(lo)=size(hi) 或 size(lo)=size(hi)+1。插入新元素后平衡两堆，中位数在 lo.top（奇）或两堆顶平均（偶）。',
    en: 'The two-heap method maintains lo (max-heap, lower half) and hi (min-heap, upper half) with size(lo)=size(hi) or size(lo)=size(hi)+1. After each insert the two heaps are rebalanced; the median is lo.top (odd) or the average of tops (even).',
  },
  tags: ['selection', 'median', 'heap', 'streaming'],
  complexity: { time: 'O(log n) 每插入', space: 'O(n)' },
};
