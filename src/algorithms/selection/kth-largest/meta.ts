// 第 k 大（小顶堆）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'kth-largest',
  categoryId: 'selection',
  title: { zh: '第 k 大（小顶堆）', en: 'Kth Largest (Min-Heap)' },
  summary: {
    zh: '维护大小为 k 的小顶堆，扫描一遍后堆顶即第 k 大。',
    en: 'Maintain a size-k min-heap; after one scan its top is the kth largest.',
  },
  description: {
    zh: '找数组中第 k 大（1-based，k=1 为最大）的经典做法：用一个容量为 k 的小顶堆。遍历每个元素：\n- 若堆中元素少于 k，直接 push\n- 否则若当前元素 > 堆顶，则弹出堆顶并 push 当前元素\n\n遍历结束后堆顶即为第 k 大。整个过程中堆里始终维护「到目前为止最大的 k 个」。\n\n- 时间 O(n log k)，空间 O(k)\n- 适合 n 很大、k 较小或数据流场景',
    en: 'Classic kth-largest via a size-k min-heap: for each element, if heap size < k push it; else if element > top, pop and push. After scanning, the top is the kth largest. The heap always holds the largest k seen so far. O(n log k) time, O(k) space; ideal for streams or large n with small k.',
  },
  tags: ['selection', 'heap', 'kth-largest', 'streaming'],
  complexity: { time: 'O(n log k)', space: 'O(k)' },
};
