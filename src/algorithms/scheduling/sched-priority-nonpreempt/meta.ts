// 优先级调度非抢占 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'sched-priority-nonpreempt',
  categoryId: 'scheduling',
  title: { zh: '优先级调度非抢占', en: 'Priority Scheduling (Non-preemptive)' },
  summary: {
    zh: '非抢占式优先级调度（数字小优先级高）。',
    en: 'Non-preemptive priority scheduling (smaller = higher).',
  },
  description: { zh: '就绪队列选优先级数字最小者。', en: 'Pick min priority number. O(n^2).' },
  tags: ['scheduling', 'priority'],
  complexity: { time: 'O(n^2)', space: 'O(n)' },
};
