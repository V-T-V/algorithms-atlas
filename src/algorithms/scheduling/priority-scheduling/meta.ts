// Priority Scheduling · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'priority-scheduling',
  categoryId: 'scheduling',
  title: { zh: '优先级调度', en: 'Priority Scheduling' },
  summary: {
    zh: '优先级调度属于scheduling类别。',
    en: 'Priority Scheduling is a scheduling algorithm.',
  },
  description: {
    zh: '优先级调度（Priority Scheduling）属于scheduling类别的算法。',
    en: 'Priority Scheduling is an algorithm in the scheduling category.',
  },
  tags: ["scheduling","data-structure"],
  complexity: { time: 'O(n²)', space: 'O(n)' },
};
