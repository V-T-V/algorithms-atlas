// 完全公平调度CFS · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'sched-cfs',
  categoryId: 'scheduling',
  title: { zh: '完全公平调度CFS', en: 'Completely Fair Scheduler (CFS)' },
  summary: {
    zh: '按 vruntime 最小选择，模拟 Linux CFS。',
    en: 'Pick min vruntime, simulating Linux CFS.',
  },
  description: {
    zh: '每次选 vruntime 最小者运行一拍。',
    en: 'Run min vruntime one tick. O(n*total).',
  },
  tags: ['scheduling', 'cfs'],
  complexity: { time: 'O(n*total)', space: 'O(n)' },
};
