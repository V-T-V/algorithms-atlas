// 合并区间 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'greedy-merge-intervals',
  categoryId: 'greedy',
  title: { zh: '合并区间', en: 'Merge Intervals' },
  summary: {
    zh: '把所有重叠的区间合并，返回不重叠区间列表。',
    en: 'Merge all overlapping intervals and return the non-overlapping list.',
  },
  description: {
    zh: '按左端点排序，依次合并：当前区间左 ≤ 上次右界则合并，否则新增。',
    en: 'Sort by left endpoint; merge when the current start ≤ last end, else start a new interval.',
  },
  tags: ['greedy', 'interval'],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
