// Round Robin · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'round-robin',
  categoryId: 'scheduling',
  title: { zh: '轮转调度', en: 'Round Robin' },
  summary: {
    zh: '轮转调度属于scheduling类别。',
    en: 'Round Robin is a scheduling algorithm.',
  },
  description: {
    zh: '轮转调度（Round Robin）属于scheduling类别的算法。',
    en: 'Round Robin is an algorithm in the scheduling category.',
  },
  tags: ["scheduling"],
  complexity: { time: 'O(n·m)', space: 'O(n)' },
};
