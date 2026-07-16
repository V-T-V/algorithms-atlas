// 数据流中位数（Median Stream）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'median-stream',
  categoryId: 'selection',
  title: { zh: '数据流中位数', en: 'Median in a Data Stream' },
  summary: {
    zh: '用大顶堆 + 小顶堆对半分流，O(log n) 插入、O(1) 查询当前中位数。',
    en: 'Balance a max-heap and min-heap to insert in O(log n) and query the running median in O(1).',
  },
  description: {
    zh: '维护两个堆：\n\n- `lo`：大顶堆，存较小的一半（堆顶是这一半的最大值）\n- `hi`：小顶堆，存较大的一半（堆顶是这一半的最小值）\n\n不变式：`lo.size === hi.size` 或 `lo.size === hi.size + 1`。\n\n`addNum(n)`：\n1. 若 `lo` 为空或 `n <= lo.top`，入 `lo`；否则入 `hi`。\n2. 平衡：若 `lo` 比 `hi` 多超过 1，把 `lo.top` 移到 `hi`；若 `hi` 比 `lo` 多，反向移动。\n\n`findMedian()`：\n- 两堆等大 → `(lo.top + hi.top) / 2`\n- 否则 → `lo.top`\n\n每次插入 `O(log n)`，查询 `O(1)`。LeetCode 295 经典题。',
    en: 'Maintain two heaps:\n\n- `lo`: max-heap holding the smaller half (top = max of this half)\n- `hi`: min-heap holding the larger half (top = min of this half)\n\nInvariant: `lo.size === hi.size` or `lo.size === hi.size + 1`.\n\n`addNum(n)`:\n1. If `lo` is empty or `n <= lo.top`, push to `lo`; else push to `hi`.\n2. Rebalance: if `lo` exceeds `hi` by more than 1, move `lo.top` to `hi`; if `hi` exceeds `lo`, move the other way.\n\n`findMedian()`:\n- Equal sizes → `(lo.top + hi.top) / 2`\n- Otherwise → `lo.top`\n\nInsert `O(log n)`, query `O(1)`. Classic LeetCode 295.',
  },
  tags: ['heap', 'streaming', 'order-statistics'],
  complexity: { time: 'O(log n) 每次插入', space: 'O(n)' },
};
