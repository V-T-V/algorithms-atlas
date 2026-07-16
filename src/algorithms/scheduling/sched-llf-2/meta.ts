import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sched-llf-2',
  categoryId: 'scheduling',
  title: { zh: '最低松弛度优先v2', en: 'LLF Scheduling v2' },
  summary: { zh: '最低松弛度优先v2。', en: 'LLF Scheduling v2.' },
  description: {
    zh: '最低松弛度优先v2属于scheduling类别。',
    en: 'LLF Scheduling v2 is a scheduling algorithm.',
  },
  tags: ["scheduling"],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
