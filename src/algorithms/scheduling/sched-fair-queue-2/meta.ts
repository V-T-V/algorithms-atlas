import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sched-fair-queue-2',
  categoryId: 'scheduling',
  title: { zh: '公平队列v2', en: 'Fair Queue v2' },
  summary: { zh: '公平队列v2。', en: 'Fair Queue v2.' },
  description: {
    zh: '公平队列v2属于scheduling类别。',
    en: 'Fair Queue v2 is a scheduling algorithm.',
  },
  tags: ["scheduling","data-structure"],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
