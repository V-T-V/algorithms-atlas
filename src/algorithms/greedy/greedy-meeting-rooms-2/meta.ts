// 会议室 II · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'greedy-meeting-rooms-2',
  categoryId: 'greedy',
  title: { zh: '会议室 II（最少间数）', en: 'Meeting Rooms II' },
  summary: {
    zh: '求安排所有会议所需的最少会议室数（最大并发重叠数）。',
    en: 'Find the minimum number of meeting rooms needed (maximum concurrent overlap).',
  },
  description: {
    zh: '把开始与结束时间分别排序，扫描时间线：遇到开始 +1、遇到结束 -1，过程中的最大值即答案。',
    en: 'Sort start and end times separately; sweep the timeline incrementing on starts and decrementing on ends; the running max is the answer.',
  },
  tags: ['greedy', 'interval', 'sweep-line'],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
