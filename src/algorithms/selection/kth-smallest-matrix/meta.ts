// 有序矩阵第 k 小 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'kth-smallest-matrix',
  categoryId: 'selection',
  title: { zh: '有序矩阵第 k 小', en: 'K-th Smallest in Sorted Matrix' },
  summary: {
    zh: '行行升序矩阵中用最小堆（按首行扩展）找第 k 小。',
    en: 'Find k-th smallest in a row-wise sorted matrix via a min-heap expansion.',
  },
  description: {
    zh: '给定 n×n 矩阵，每行每列均升序。将第一行所有元素入最小堆，每次弹出最小者，并将其「正下方」元素入堆（利用行内升序）。弹出 k 次即为第 k 小。\n\n- 堆元素记录 (值, 行, 列)\n- 弹出后只把同列下一行元素入堆\n- 第 k 次弹出的值即答案\n\n时间 O(k·log n)，空间 O(n)。',
    en: 'Given an n×n matrix sorted row- and column-wise, push the first row into a min-heap; each pop of the minimum is followed by pushing the element directly below it (exploiting row-wise order). The k-th popped value is the answer.\n\n- Heap element: (value, row, col)\n- After popping, push the element at (row+1, col)\n- The k-th popped value is the answer\n\nTime O(k·log n), space O(n).',
  },
  tags: ['heap', 'matrix', 'order-statistics'],
  complexity: { time: 'O(k log n)', space: 'O(n)' },
};
