import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sched-rate-monotonic-3',
  categoryId: 'scheduling',
  title: { zh: '速率单调调度v3', en: 'Rate Monotonic v3' },
  summary: { zh: '速率单调调度v3。', en: 'Rate Monotonic v3.' },
  description: {
    zh: '速率单调调度v3属于scheduling类别。',
    en: 'Rate Monotonic v3 is a scheduling algorithm.',
  },
  tags: ["scheduling"],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
