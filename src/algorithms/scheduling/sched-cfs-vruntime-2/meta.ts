import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sched-cfs-vruntime-2',
  categoryId: 'scheduling',
  title: { zh: 'CFS虚拟运行时调度v2', en: 'CFS VRuntime Scheduling v2' },
  summary: { zh: 'CFS虚拟运行时调度v2。', en: 'CFS VRuntime Scheduling v2.' },
  description: {
    zh: 'CFS虚拟运行时调度v2属于scheduling类别。',
    en: 'CFS VRuntime Scheduling v2 is a scheduling algorithm.',
  },
  tags: ["scheduling"],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
