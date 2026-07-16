// 老化优先级调度 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'sched-aging',
  categoryId: 'scheduling',
  title: { zh: '老化优先级调度', en: 'Priority with Aging' },
  summary: {
    zh: '等待越久优先级越高，防止饥饿。',
    en: 'Priority increases with wait time, prevents starvation.',
  },
  description: {
    zh: '动态优先级 = base - wait/agingRate。',
    en: 'Dynamic priority = base - wait/rate. O(n^2).',
  },
  tags: ['scheduling', 'aging'],
  complexity: { time: 'O(n^2)', space: 'O(n)' },
};
