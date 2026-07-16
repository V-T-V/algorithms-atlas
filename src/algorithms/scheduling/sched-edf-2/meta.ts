import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sched-edf-2',
  categoryId: 'scheduling',
  title: { zh: '最早截止期优先v2', en: 'EDF Scheduling v2' },
  summary: { zh: '最早截止期优先v2。', en: 'EDF Scheduling v2.' },
  description: {
    zh: '最早截止期优先v2属于scheduling类别。',
    en: 'EDF Scheduling v2 is a scheduling algorithm.',
  },
  tags: ["scheduling"],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
