// 最短剩余时间优先 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'sched-srtf-preempt',
  categoryId: 'scheduling',
  title: { zh: '最短剩余时间优先', en: 'Shortest Remaining Time First' },
  summary: {
    zh: '抢占式 SJF，每次选剩余时间最短。',
    en: 'Preemptive SJF: pick min remaining time each tick.',
  },
  description: {
    zh: '每时间单位选剩余 burst 最小者。',
    en: 'Per tick pick min remaining. O(n*maxburst).',
  },
  tags: ['scheduling', 'srtf', 'preemptive'],
  complexity: { time: 'O(n*maxburst)', space: 'O(n)' },
};
