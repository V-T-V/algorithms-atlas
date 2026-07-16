// Binary Heap · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'heap',
  categoryId: 'ds',
  title: { zh: '二叉堆', en: 'Binary Heap' },
  summary: {
    zh: '二叉堆属于ds类别。',
    en: 'Binary Heap is a ds algorithm.',
  },
  description: {
    zh: '二叉堆（Binary Heap）属于ds类别的算法。',
    en: 'Binary Heap is an algorithm in the ds category.',
  },
  tags: ["ds","data-structure"],
  complexity: { time: 'O(log n) 插入/弹出，O(n) 建堆', space: 'O(n)' },
};
