// 短作业优先非抢占 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'sched-sjf-nonpreempt',
  categoryId: 'scheduling',
  title: { zh: '短作业优先非抢占', en: 'Shortest Job First (Non-preemptive)' },
  summary: { zh: '非抢占式最短作业优先调度。', en: 'Non-preemptive shortest job first.' },
  description: {
    zh: '就绪队列中选 burst 最小者执行。',
    en: 'Pick min burst from ready queue. O(n^2).',
  },
  tags: ['scheduling', 'sjf'],
  complexity: { time: 'O(n^2)', space: 'O(n)' },
};
