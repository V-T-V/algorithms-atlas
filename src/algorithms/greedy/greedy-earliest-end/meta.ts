// 区间调度（最早结束优先）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'greedy-earliest-end',
  categoryId: 'greedy',
  title: { zh: '区间调度（最早结束优先）', en: 'Interval Scheduling (Earliest End First)' },
  summary: {
    zh: '在若干区间中选出最多的互不重叠子集。',
    en: 'Select the largest subset of mutually non-overlapping intervals.',
  },
  description: {
    zh: '按结束时间排序，贪心选最早结束且与已选不冲突的区间。这是经典贪心正确性范例。',
    en: 'Sort by end time, greedily pick the earliest-ending interval not conflicting with the last chosen.',
  },
  tags: ['greedy', 'interval', 'exchange-argument'],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
