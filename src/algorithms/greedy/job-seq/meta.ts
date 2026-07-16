// Job Sequencing · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'job-seq',
  categoryId: 'greedy',
  title: { zh: '作业调度', en: 'Job Sequencing' },
  summary: {
    zh: '作业调度属于greedy类别。',
    en: 'Job Sequencing is a greedy algorithm.',
  },
  description: {
    zh: '作业调度（Job Sequencing）属于greedy类别的算法。',
    en: 'Job Sequencing is an algorithm in the greedy category.',
  },
  tags: ["greedy"],
  complexity: { time: 'O(n²)', space: 'O(n)' },
};
