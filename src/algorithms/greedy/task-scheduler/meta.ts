// Task Scheduler · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'task-scheduler',
  categoryId: 'greedy',
  title: { zh: '任务调度器', en: 'Task Scheduler' },
  summary: {
    zh: '任务调度器属于greedy类别。',
    en: 'Task Scheduler is a greedy algorithm.',
  },
  description: {
    zh: '任务调度器（Task Scheduler）属于greedy类别的算法。',
    en: 'Task Scheduler is an algorithm in the greedy category.',
  },
  tags: ["greedy","scheduling"],
  complexity: { time: 'O(?)', space: 'O(?)' },
};
