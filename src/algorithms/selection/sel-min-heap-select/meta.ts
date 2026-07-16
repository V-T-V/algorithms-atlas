// 最小堆选择（Min-Heap Select）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sel-min-heap-select',
  categoryId: 'selection',
  title: { zh: '最小堆选择', en: 'Min-Heap Select' },
  summary: {
    zh: '建最小堆后弹出 k 次得第 k 小。',
    en: 'Build a min-heap, pop k times for the k-th smallest.',
  },
  description: {
    zh: '最小堆选择：先 O(n) 建堆，再执行 k 次 pop-min，最后一次弹出即第 k 小。适合 k 较小。',
    en: 'Min-heap select: build a heap in O(n), then pop-min k times; the last pop is the k-th smallest. Good for small k.',
  },
  tags: ['selection', 'heap', 'min-heap'],
  complexity: { time: 'O(n + k log n)', space: 'O(n)' },
};
