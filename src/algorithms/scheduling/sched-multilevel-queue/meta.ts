// 多级队列 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'sched-multilevel-queue',
  categoryId: 'scheduling',
  title: { zh: '多级队列', en: 'Multilevel Queue' },
  summary: {
    zh: '按类型分到不同队列，固定优先级调度。',
    en: 'Categorize into queues, fixed-priority scheduling.',
  },
  description: {
    zh: '高优先级队列优先，队列内 FCFS。',
    en: 'Higher-priority queue first, FCFS within. O(n log n).',
  },
  tags: ['scheduling', 'multilevel'],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
