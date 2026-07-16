// 到达时间排序 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'sched-arrival-sort',
  categoryId: 'scheduling',
  title: { zh: '到达时间排序', en: 'Arrival Time Sort Scheduling' },
  summary: {
    zh: '按到达时间升序调度（同 FCFS 但显式排序）。',
    en: 'Schedule by ascending arrival time.',
  },
  description: { zh: '稳定排序后顺序执行。', en: 'Stable sort then run. O(n log n).' },
  tags: ['scheduling', 'sort'],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
