// 多核FCFS · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'sched-multicore-fcfs',
  categoryId: 'scheduling',
  title: { zh: '多核FCFS', en: 'Multicore FCFS' },
  summary: {
    zh: '把 FCFS 队列分发到多个核心。',
    en: 'Distribute FCFS queue across multiple cores.',
  },
  description: { zh: '每任务分配到最早空闲核。', en: 'Assign to earliest-idle core. O(n*m).' },
  tags: ['scheduling', 'multicore', 'fcfs'],
  complexity: { time: 'O(n*m)', space: 'O(m)' },
};
