// 滑动窗口中位数（双堆）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sliding-window-median',
  categoryId: 'design',
  title: { zh: '滑动窗口中位数（双堆）', en: 'Sliding Window Median (Two Heaps)' },
  summary: {
    zh: '用大小顶堆（含懒删除）维护窗口，平衡堆大小即可 O(log k) 取中位数。',
    en: 'Maintain a max-heap and min-heap (with lazy deletion) over the window; balance sizes to get median in O(log k).',
  },
  description: {
    zh: '求每个大小为 k 的滑动窗口的中位数。朴素法每窗口排序 O(n·k·log k)；双堆法 O(n·log k)：\n\n- **lo**（大顶堆，存较小一半）+ **hi**（小顶堆，存较大一半）\n- 不变式：lo.size == hi.size（k 偶）或 lo.size == hi.size + 1（k 奇）\n- 中位数：k 奇 → lo.top；k 偶 → (lo.top + hi.top)/2\n- 滑动时：插入新元素到对应堆并重平衡；用「懒删除」——出窗的元素标记延迟移除，堆顶是过期值时再弹出\n\n由于 JS 无内置堆，本实现用排序数组模拟堆操作以保证正确性，trace 中展示两堆内容与中位数。',
    en: 'Find the median of each size-k sliding window. Naively O(n·k·log k) per window sort; the two-heap approach is O(n·log k):\n\n- **lo** (max-heap, smaller half) + **hi** (min-heap, larger half)\n- Invariant: lo.size == hi.size (even k) or lo.size == hi.size + 1 (odd k)\n- Median: odd k → lo.top; even k → (lo.top + hi.top)/2\n- On sliding: insert the new element into the right heap and rebalance; use "lazy deletion" — mark outgoing elements for delayed removal, popping expired tops lazily\n\nSince JS has no built-in heap, this implementation uses sorted arrays to simulate heap operations for correctness; the trace shows both heaps and the median.',
  },
  tags: ['design', 'sliding-window', 'heap', 'median', 'ordered-statistic'],
  complexity: { time: 'O(n log k)', space: 'O(k)' },
};
