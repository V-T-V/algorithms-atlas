// 最大堆选择（Max-Heap Select）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sel-max-heap-select',
  categoryId: 'selection',
  title: { zh: '最大堆选择', en: 'Max-Heap Select' },
  summary: {
    zh: '建最大堆后弹出 (n−k) 次得第 k 小。',
    en: 'Build a max-heap, pop (n−k) times for the k-th smallest.',
  },
  description: {
    zh: '最大堆选择：建最大堆，连续弹出直到剩下 k 个，堆顶即第 k 小。适合 k 接近 n。',
    en: 'Max-heap select: build a max-heap, pop repeatedly until k remain; the root is the k-th smallest. Good for k near n.',
  },
  tags: ['selection', 'heap', 'max-heap'],
  complexity: { time: 'O(n + (n−k) log n)', space: 'O(n)' },
};
