// 最早截止时间优先 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'sched-edf',
  categoryId: 'scheduling',
  title: { zh: '最早截止时间优先', en: 'Earliest Deadline First' },
  summary: {
    zh: '实时调度：选截止时间最早的进程。',
    en: 'Real-time: pick process with earliest deadline.',
  },
  description: {
    zh: '抢占式，每刻选 deadline 最小。',
    en: 'Preemptive, min deadline each tick. O(n*total).',
  },
  tags: ['scheduling', 'real-time', 'edf'],
  complexity: { time: 'O(n*total)', space: 'O(n)' },
};
