// 速率单调调度 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'sched-rate-monotonic',
  categoryId: 'scheduling',
  title: { zh: '速率单调调度', en: 'Rate Monotonic Scheduling' },
  summary: {
    zh: '周期任务，周期短者优先（静态优先级）。',
    en: 'Periodic tasks, shorter period = higher priority (static).',
  },
  description: { zh: '周期越小优先级越高。', en: 'Shorter period = higher priority. O(n).' },
  tags: ['scheduling', 'real-time', 'rms'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
