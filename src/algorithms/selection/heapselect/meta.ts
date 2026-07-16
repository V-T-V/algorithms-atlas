// 堆选择（Heapselect）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'heapselect',
  categoryId: 'selection',
  title: { zh: '堆选择', en: 'Heapselect' },
  summary: {
    zh: '维护大小为 k 的最大堆，遍历一次数组即可选出第 k 小元素。',
    en: 'Keep a max-heap of size k to pick the k-th smallest in one pass.',
  },
  description: {
    zh: '堆选择用一个容量为 k 的最大堆来求前 k 小（堆顶即第 k 小）：\n\n- 遍历数组每个元素：若堆大小 < k，直接入堆；否则若当前元素小于堆顶，弹出堆顶并把当前元素入堆。\n- 由于堆中始终保留目前见过的最小的 k 个元素，遍历结束后堆顶即为第 k 小。\n\n时间 `O(n log k)`，空间 `O(k)`。当 k 较小时近似线性；常用于 Top-K、流式数据。',
    en: 'Heapselect keeps a max-heap of capacity k to find the k smallest seen so far:\n\n- For each element: if heap size < k, push; else if element < heap top, pop the top then push the element.\n- The heap always holds the k smallest seen, so its top is the k-th smallest at the end.\n\nTime `O(n log k)`, space `O(k)`. Near-linear when k is small; common for Top-K and streaming.',
  },
  tags: ['heap', 'order-statistics', 'streaming'],
  complexity: { time: 'O(n log k)', space: 'O(k)' },
};
