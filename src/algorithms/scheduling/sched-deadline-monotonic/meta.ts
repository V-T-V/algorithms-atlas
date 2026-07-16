// 截止时间单调调度 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'sched-deadline-monotonic',
  categoryId: 'scheduling',
  title: { zh: '截止时间单调调度', en: 'Deadline Monotonic Scheduling' },
  summary: {
    zh: '相对截止时间短者优先（静态）。',
    en: 'Shorter relative deadline = higher priority (static).',
  },
  description: { zh: 'D 越小优先级越高。', en: 'Smaller D = higher pri. O(n log n).' },
  tags: ['scheduling', 'real-time'],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
