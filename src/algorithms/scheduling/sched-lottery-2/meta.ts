import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sched-lottery-2',
  categoryId: 'scheduling',
  title: { zh: '彩票调度v2', en: 'Lottery Scheduling v2' },
  summary: { zh: '彩票调度v2。', en: 'Lottery Scheduling v2.' },
  description: {
    zh: '彩票调度v2属于scheduling类别。',
    en: 'Lottery Scheduling v2 is a scheduling algorithm.',
  },
  tags: ["scheduling"],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
