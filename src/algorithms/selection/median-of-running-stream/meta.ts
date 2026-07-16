// 运行数据流中位数（滑动窗口双堆）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'median-of-running-stream',
  categoryId: 'selection',
  title: { zh: '滑动窗口中位数（双堆）', en: 'Sliding Window Median (Dual Heap)' },
  summary: {
    zh: '用一大一小两个堆维护窗口内有序结构，O(log k) 取中位数。',
    en: 'Two heaps (lower max-heap + upper min-heap) maintain window order; median in O(log k).',
  },
  description: {
    zh: '对长度为 k 的滑动窗口求中位数。维护两个堆：lower（最大堆，存较小的一半）与 upper（最小堆，存较大的一半），并保持 size(lower) − size(upper) ∈ {0, 1}。窗口右移时先插入新元素（按堆顶归类并平衡），再懒删除离开窗口的元素（标记延迟，待其浮到堆顶时弹出）。每次平衡后中位数 = lower 堆顶（奇数）或两堆顶平均（偶数）。\n\n每个元素进出堆 O(log k)，整体 O(n log k)。',
    en: 'Maintain a max-heap `lower` for the smaller half and a min-heap `upper` for the larger half, keeping |lower| − |upper| ∈ {0,1}. On window slide, insert the new element and lazily remove the departing one (mark delayed; pop when it surfaces). Median = top of lower (odd) or average of both tops (even). Overall O(n log k).',
  },
  tags: ['selection', 'median', 'sliding-window', 'heap', 'two-heap'],
  complexity: { time: 'O(n log k)', space: 'O(k)' },
};
