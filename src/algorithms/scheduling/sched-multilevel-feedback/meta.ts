// 多级反馈队列 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'sched-multilevel-feedback',
  categoryId: 'scheduling',
  title: { zh: '多级反馈队列', en: 'Multilevel Feedback Queue' },
  summary: {
    zh: '多级队列，降级运行过久的进程。',
    en: 'Multi queues with demotion for long-running processes.',
  },
  description: {
    zh: '顶层 RR 短时间片，用完降级。',
    en: 'RR top short, demote on quantum exhaust. O(n*total).',
  },
  tags: ['scheduling', 'mlfq'],
  complexity: { time: 'O(n*total)', space: 'O(n)' },
};
