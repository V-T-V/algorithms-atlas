// 优先队列第 k · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sel-kth-priority-queue',
  categoryId: 'selection',
  title: { zh: '优先队列第 k 小', en: 'k-th Smallest via Priority Queue' },
  summary: {
    zh: '全部入最小堆，弹出 k 次得第 k 小，O(n + k log n)。',
    en: 'Push all into a min-heap and pop k times for the k-th smallest, O(n + k log n).',
  },
  description: {
    zh: '优先队列法：把 n 个元素全部入最小堆（O(n)），再弹出 k 次（每次 O(log n)），第 k 次弹出即第 k 小。适合 k 较小或需要前 k 个有序时。',
    en: 'Priority-queue method: heapify all n elements (O(n)), then pop k times (O(log n) each); the k-th pop is the k-th smallest. Ideal for small k or when the top k must be ordered.',
  },
  tags: ['selection', 'heap', 'priority-queue'],
  complexity: { time: 'O(n + k log n)', space: 'O(n)' },
};
