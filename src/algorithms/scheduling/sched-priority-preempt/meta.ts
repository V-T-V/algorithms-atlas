// 优先级抢占 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'sched-priority-preempt',
  categoryId: 'scheduling',
  title: { zh: '优先级抢占', en: 'Priority Preemptive' },
  summary: {
    zh: '高优先级进程到达时抢占当前。',
    en: 'Preempt when higher-priority process arrives.',
  },
  description: {
    zh: '每刻选优先级最高（数字最小）。',
    en: 'Pick min priority each tick. O(n*total).',
  },
  tags: ['scheduling', 'preemptive', 'priority'],
  complexity: { time: 'O(n*total)', space: 'O(n)' },
};
