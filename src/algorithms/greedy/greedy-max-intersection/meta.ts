// 最大重叠区间 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'greedy-max-intersection',
  categoryId: 'greedy',
  title: { zh: '最大重叠区间', en: 'Maximum Overlapping Interval' },
  summary: {
    zh: '求某一时刻同时被多少个区间覆盖的最大值。',
    en: 'Find the maximum number of intervals overlapping at any point.',
  },
  description: {
    zh: '把所有端点拆成 (位置,±1) 事件排序后扫描，维护当前覆盖数，记录最大值。',
    en: 'Split endpoints into (pos, ±1) events, sort and sweep, tracking the running count.',
  },
  tags: ['greedy', 'interval', 'sweep-line'],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
