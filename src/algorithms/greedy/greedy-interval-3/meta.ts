// 区间调度（最多不重叠） · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'greedy-interval-3',
  categoryId: 'greedy',
  title: { zh: '区间调度（最多不重叠）', en: 'Interval Scheduling' },
  summary: {
    zh: '按结束时间升序选不重叠区间，得到最大数量。',
    en: 'Sort intervals by end time and greedily pick non-overlapping ones for maximum count.',
  },
  description: {
    zh: '区间调度问题：给一组区间 [s, e)，求最多能选多少互不重叠的。贪心按结束时间排序即可。',
    en: 'Interval scheduling: given intervals [s, e), find the maximum count of mutually non-overlapping ones. Greedy by earliest end time.',
  },
  tags: ['greedy', 'interval', 'leetcode'],
  complexity: { time: 'O(n log n)', space: 'O(1)' },
};
