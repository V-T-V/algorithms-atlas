// 滑动窗口中位数变种 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sel-median-rolling-window-2',
  categoryId: 'selection',
  title: { zh: '滑动窗口中位数（双索引堆）', en: 'Sliding Window Median (Dual-Index-Heap)' },
  summary: {
    zh: '窗口右滑时维护两个索引堆（小顶+大顶）求中位数。',
    en: 'Maintain two indexed heaps (min+max) as the window slides to report medians.',
  },
  description: {
    zh: '滑动窗口中位数：用两个索引堆 lo（大顶）与 hi（小顶），保持 lo 的大小等于或多 1 于 hi。窗口右移加入新元素、移除最左元素（懒删除）。每个位置输出当前中位数。',
    en: "Sliding window median: two indexed heaps lo (max) and hi (min), keeping lo's size equal to or one more than hi. As the window slides right, insert the new element and lazily remove the leftmost. Report the median at each step.",
  },
  tags: ['selection', 'median', 'sliding-window', 'heap'],
  complexity: { time: 'O(n log n)', space: 'O(k)' },
};
