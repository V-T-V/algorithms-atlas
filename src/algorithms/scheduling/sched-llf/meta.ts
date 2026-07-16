// 最松弛优先 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'sched-llf',
  categoryId: 'scheduling',
  title: { zh: '最松弛优先', en: 'Least Laxity First' },
  summary: {
    zh: '实时调度：选松弛度最小的进程。',
    en: 'Real-time: pick process with least laxity.',
  },
  description: {
    zh: '松弛 = deadline - time - remaining。',
    en: 'laxity = deadline - time - rem. O(n*total).',
  },
  tags: ['scheduling', 'real-time', 'llf'],
  complexity: { time: 'O(n*total)', space: 'O(n)' },
};
