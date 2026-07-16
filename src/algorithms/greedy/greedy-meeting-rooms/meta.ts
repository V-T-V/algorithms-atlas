// 会议室 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'greedy-meeting-rooms',
  categoryId: 'greedy',
  title: { zh: '会议室（能否全部安排）', en: 'Meeting Rooms' },
  summary: {
    zh: '判断一组会议时间是否互不重叠（能否用一间会议室安排）。',
    en: 'Check whether a set of meeting intervals are non-overlapping (fit in one room).',
  },
  description: {
    zh: '按开始时间排序，扫描相邻区间是否重叠。',
    en: 'Sort by start time, scan adjacent intervals for overlap.',
  },
  tags: ['greedy', 'interval'],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
