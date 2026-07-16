// 配对堆选择（Pairing-Heap Select）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sel-pair-heap-select',
  categoryId: 'selection',
  title: { zh: '配对堆选择', en: 'Pairing-Heap Select' },
  summary: {
    zh: '用配对堆做第 k 小：O(log n) 摊还弹出。',
    en: 'Use a pairing heap for k-th smallest: O(log n) amortized pop.',
  },
  description: {
    zh: '配对堆（Fredman 等）支持高效合并与删除最小；建堆后弹出 k 次得第 k 小。本实现用简化的配对堆。',
    en: 'Pairing heap (Fredman et al.) supports efficient merge and delete-min; pop k times after building for the k-th smallest. Simplified pairing heap impl.',
  },
  tags: ['selection', 'heap', 'pairing-heap'],
  complexity: { time: 'O(n + k log n) amortized', space: 'O(n)' },
};
