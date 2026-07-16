// Top-K 堆 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sel-top-k-heap',
  categoryId: 'selection',
  title: { zh: 'Top-K 堆选择', en: 'Top-K Heap Selection' },
  summary: {
    zh: '用容量 k 的最小堆维护前 k 大元素，O(n log k)。',
    en: 'Keep a min-heap of size k for the top-k largest elements, O(n log k).',
  },
  description: {
    zh: 'Top-K 堆：维护大小为 k 的最小堆。遍历数组时若元素大于堆顶则替换。结束后堆中即 Top-K。适合 n 远大于 k 的场景。',
    en: 'Top-K heap: keep a min-heap of size k. While scanning, replace the top whenever a larger element arrives. The heap holds the Top-K at the end. Ideal when n >> k.',
  },
  tags: ['selection', 'top-k', 'heap'],
  complexity: { time: 'O(n log k)', space: 'O(k)' },
};
