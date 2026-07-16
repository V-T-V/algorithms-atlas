// 作业池调度 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'sched-job-pool',
  categoryId: 'scheduling',
  title: { zh: '作业池调度', en: 'Job Pool Scheduling' },
  summary: {
    zh: '维护作业池，按策略函数选下一个。',
    en: 'Maintain job pool, pick next via policy function.',
  },
  description: { zh: '可插拔策略：FCFS/SJF/Priority。', en: 'Pluggable policy. O(n^2).' },
  tags: ['scheduling', 'pool'],
  complexity: { time: 'O(n^2)', space: 'O(n)' },
};
