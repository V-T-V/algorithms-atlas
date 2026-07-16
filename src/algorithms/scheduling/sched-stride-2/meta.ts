import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sched-stride-2',
  categoryId: 'scheduling',
  title: { zh: '步幅调度v2', en: 'Stride Scheduling v2' },
  summary: { zh: '步幅调度v2。', en: 'Stride Scheduling v2.' },
  description: {
    zh: '步幅调度v2属于scheduling类别。',
    en: 'Stride Scheduling v2 is a scheduling algorithm.',
  },
  tags: ["scheduling"],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
